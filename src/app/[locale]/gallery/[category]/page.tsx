import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GalleryGrid } from "@/components/gallery-grid";
import { getImagesByCategory } from "@/lib/gallery-data";
import {
  CATEGORIES,
  CATEGORY_I18N_KEY,
  isCategory,
} from "@/lib/gallery";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

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
      {/* Category tabs */}
      <nav className="mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/gallery/${cat}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              cat === category
                ? "bg-primary text-white"
                : "bg-muted hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {t(CATEGORY_I18N_KEY[cat])}
          </Link>
        ))}
      </nav>

      <h1 className="mb-6 text-center text-2xl font-bold">
        {t(CATEGORY_I18N_KEY[category])}
      </h1>

      <GalleryGrid images={images} isAdmin={isAdmin} category={category} />
    </div>
  );
}
