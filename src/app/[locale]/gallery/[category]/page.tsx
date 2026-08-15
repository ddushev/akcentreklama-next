import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Printer, Car, Megaphone, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GalleryGrid } from "@/components/gallery-grid";
import { getImagesByCategory } from "@/lib/gallery-data";
import {
  CATEGORIES,
  CATEGORY_I18N_KEY,
  isCategory,
  type CategorySlug,
} from "@/lib/gallery";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

// Same icons the home page uses for each service, reused in the gallery nav.
const CATEGORY_ICON: Record<CategorySlug, LucideIcon> = {
  "screen-printing": Printer,
  "vehicle-branding": Car,
  "outdoor-advertising": Megaphone,
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!isCategory(category)) {
    notFound();
  }

  const t = await getTranslations("gallery");
  const [images, supabase] = await Promise.all([
    getImagesByCategory(category),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = Boolean(user);

  return (
    <div className="mx-auto w-[90%] max-w-6xl py-10">
      {/* Category nav — icon tiles matching the home page services. */}
      <nav className="mb-8 grid gap-8 sm:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICON[cat];
          const isCurrent = cat === category;
          return (
            <Link
              key={cat}
              href={`/gallery/${cat}`}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "group flex flex-col items-center gap-4 rounded-xl border p-8 text-center transition-all",
                isCurrent
                  ? "-translate-y-0.5 border-brand-green bg-primary text-white shadow-lg ring-2 ring-brand-green"
                  : "border-border hover:border-brand-green hover:shadow-lg",
              )}
            >
              <span
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full transition-transform group-hover:scale-110",
                  isCurrent
                    ? "bg-brand-green text-primary"
                    : "bg-primary text-brand-green",
                )}
              >
                <Icon className="h-10 w-10" />
              </span>
              <span
                className={cn(
                  "text-lg font-semibold",
                  isCurrent ? "text-white" : "group-hover:text-brand-green",
                )}
              >
                {t(CATEGORY_I18N_KEY[cat])}
              </span>
            </Link>
          );
        })}
      </nav>

      <h1 className="sr-only">{t(CATEGORY_I18N_KEY[category])}</h1>

      <GalleryGrid images={images} isAdmin={isAdmin} category={category} />
    </div>
  );
}
