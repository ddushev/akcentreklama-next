import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BadgePercent,
  Car,
  Factory,
  Megaphone,
  Printer,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ContactCta } from "@/components/contact-cta";
// Static imports let Next generate a tiny blurDataURL at build time, so the
// hero shows a blurred preview instantly instead of an empty box while loading.
import heroImage from "../../../public/images/hero.jpg";
import screenPrintingImage from "../../../public/images/about-screen-printing.jpg";
import vehicleBrandingImage from "../../../public/images/about-vehicle-branding.jpg";
import outdoorAdvertisingImage from "../../../public/images/about-outdoor-advertising.jpg";

const SERVICES = [
  {
    key: "screenPrinting",
    href: "/gallery/screen-printing",
    Icon: Printer,
    image: screenPrintingImage,
  },
  {
    key: "vehicleBranding",
    href: "/gallery/vehicle-branding",
    Icon: Car,
    image: vehicleBrandingImage,
  },
  {
    key: "outdoorAdvertising",
    href: "/gallery/outdoor-advertising",
    Icon: Megaphone,
    image: outdoorAdvertisingImage,
  },
] as const;

const HIGHLIGHTS = [
  { key: "ownPrintingHouse", Icon: Factory },
  { key: "competitivePrices", Icon: BadgePercent },
  { key: "experience", Icon: Award },
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tAbout = await getTranslations("about");

  return (
    <>
      {/* Hero. bg-primary is the fallback colour until the photo (or its blur) paints. */}
      <section className="relative isolate overflow-hidden bg-primary text-white">
        <Image
          src={heroImage}
          alt=""
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Solid tint on mobile; on wider screens fade from the text side so the photo shows on the right. */}
        <div className="absolute inset-0 -z-10 bg-primary/85 md:bg-transparent md:bg-linear-to-r md:from-primary md:via-primary/85 md:to-primary/25" />

        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {t.rich("heroTitle", {
                accent: (chunks) => <span className="text-brand-green">{chunks}</span>,
              })}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-pretty text-white/80 sm:text-lg">
              {t("heroSubtitle")}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contacts"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-green px-6 font-semibold text-primary transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("contactUs")}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/gallery/screen-printing"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-6 font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("viewWork")}
              </Link>
            </div>
          </div>

          <ul className="mt-14 grid gap-4 border-t border-white/15 pt-8 sm:grid-cols-3">
            {HIGHLIGHTS.map(({ key, Icon }) => (
              <li key={key} className="flex items-center gap-3 font-medium">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-green">
                  <Icon className="size-5" aria-hidden />
                </span>
                {t(`highlights.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services: photo cards linking to each gallery. */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {t("servicesEyebrow")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {t("servicesTitle")}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SERVICES.map(({ key, href, Icon, image }) => (
            <Link
              key={key}
              href={href}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-brand-green hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative flex flex-1 flex-col p-6 pt-10">
                <span className="absolute -top-7 left-6 flex size-14 items-center justify-center rounded-full bg-primary text-brand-green shadow-lg ring-4 ring-card">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
                  {t(`services.${key}`)}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                  {t(`servicesDesc.${key}`)}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">
                  {tAbout("viewGallery")}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
