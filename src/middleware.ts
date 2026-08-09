import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run the next-intl middleware first — it handles locale detection and
  //    produces the response (with any locale redirect/rewrite applied).
  const response = intlMiddleware(request);

  // 2. Refresh the Supabase auth session and mirror cookies onto that response.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. Refresh the session cookie by reading the user. There are no
  //    middleware-protected routes: /admin is the public login screen and the
  //    gallery pages are public — they simply render extra admin controls when
  //    a session exists (checked server-side on the page itself).
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Skip static assets, Next internals, and files with an extension.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
