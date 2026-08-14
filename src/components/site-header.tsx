"use client";

import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "gallery", href: "/gallery/screen-printing" },
  { key: "contacts", href: "/contacts" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const tAdmin = useTranslations("admin");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Track auth state so the Sign out control appears only for a logged-in admin
  // and updates reactively after login/logout (no manual reload needed).
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsAdmin(Boolean(data.user)));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setIsAdmin(Boolean(session?.user)),
    );
    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/"));

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur border-b-4 border-brand-green text-white">
      <div className="mx-auto flex w-[90%] max-w-6xl items-center justify-between py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-brand-green">
            {tBrand("name")}
          </span>
          <span className="hidden text-sm uppercase tracking-wide sm:inline">
            {tBrand("tagline")}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-bold uppercase transition-colors hover:text-brand-green",
                isActive(item.href) && "text-brand-green",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="ml-2 flex items-center">
            <LanguageSwitcher />
            {/* <ThemeToggle /> */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="ml-1 text-white hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                {tAdmin("signOut")}
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center md:hidden">
          <LanguageSwitcher />
          {/* <ThemeToggle /> */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            className="text-white hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-white/10 md:hidden">
          <div className="mx-auto flex w-[90%] max-w-6xl flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-3 text-sm font-bold uppercase transition-colors hover:text-brand-green",
                  isActive(item.href) && "text-brand-green",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            {isAdmin && (
              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-2 py-3 text-left text-sm font-bold uppercase transition-colors hover:text-brand-green"
              >
                <LogOut className="h-4 w-4" />
                {tAdmin("signOut")}
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
