import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrandTint } from "@/components/photo-tints";
import { ContactCta } from "@/components/contact-cta";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";
// Static import gives the photo an automatic blur placeholder while it loads.
import agencyImage from "../../public/images/about-agency.jpg";

export async function AboutContent() {
  const t = await getTranslations("about");

  return (
    <>
      {/* Intro: text + the agency photo. Stacks on mobile, side by side from lg. */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {t("titles.about")}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t("headline")}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {t("about")}
          </p>
        </div>
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-muted shadow-xl">
          <Image
            src={agencyImage}
            alt=""
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <BrandTint />
        </div>
      </section>

      {/* Services: alternating photo/text rows, each linking to its gallery. */}
      <section className="bg-muted/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              {t("servicesEyebrow")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {t("servicesTitle")}
            </h2>
          </div>

          <div className="mt-12 flex flex-col gap-16 sm:gap-20">
            {SERVICES.map(({ key, href, image }, index) => (
              <article
                key={key}
                className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
              >
                <Link
                  href={href}
                  tabIndex={-1}
                  aria-hidden
                  className={cn(
                    "group relative aspect-video overflow-hidden rounded-2xl bg-muted shadow-lg",
                    index % 2 === 1 && "md:order-last",
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <BrandTint />
                </Link>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {t(`titles.${key}`)}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                    {t(key)}
                  </p>
                  <Link
                    href={href}
                    className="group mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t("viewGallery")}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-16 sm:pt-24">
        <ContactCta />
      </div>
    </>
  );
}
