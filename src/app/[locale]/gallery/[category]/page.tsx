import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GalleryGrid } from "@/components/gallery-grid";
import { ContactCta } from "@/components/contact-cta";
import { getImagesByCategory } from "@/lib/gallery-data";
import { CATEGORIES, isCategory } from "@/lib/gallery";
import { SERVICES, getService } from "@/lib/services";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

// TODO: Convert this to a static page
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
  const tHome = await getTranslations("home");
  const { key: currentKey } = getService(category);
  const [images, supabase] = await Promise.all([
    getImagesByCategory(category),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = Boolean(user);

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {t(currentKey)}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {tHome(`servicesDesc.${currentKey}`)}
        </p>

        {/* Category switcher — compact pills so the photos stay the focus. */}
        <nav className="mt-8 flex flex-wrap gap-3">
          {SERVICES.map(({ slug, key, href, Icon }) => {
            const isCurrent = slug === category;
            return (
              <Link
                key={slug}
                href={href}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full border px-5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                <Icon
                  className={cn("size-4", isCurrent && "text-brand-green")}
                  aria-hidden
                />
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-10">
          <GalleryGrid images={images} isAdmin={isAdmin} category={category} />
        </div>
      </div>

      <ContactCta />
    </>
  );
}
