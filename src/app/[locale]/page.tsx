import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Printer, Car, Megaphone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HomeCta } from "@/components/home-cta";

const SERVICES = [
  { key: "screenPrinting", href: "/gallery/screen-printing", Icon: Printer },
  { key: "vehicleBranding", href: "/gallery/vehicle-branding", Icon: Car },
  { key: "outdoorAdvertising", href: "/gallery/outdoor-advertising", Icon: Megaphone },
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-20 text-center text-white">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        {/* Dark gradient overlay keeps the heading readable over the photo. */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/70 to-black/60" />
        <div className="relative mx-auto max-w-4xl space-y-6">
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl"
            style={{ textShadow: "0 0 30px var(--brand-green)" }}
          >
            {t("heroTitle")}
          </h1>
          <p className="text-base text-white/90 sm:text-lg">{t("heroSubtitle")}</p>
        </div>
      </section>

      {/* CTA bar */}
      <HomeCta />

      {/* Service boxes */}
      <section className="mx-auto grid w-[90%] max-w-6xl gap-8 py-16 sm:grid-cols-3">
        {SERVICES.map(({ key, href, Icon }) => (
          <Link
            key={key}
            href={href}
            className="group flex flex-col items-center gap-4 rounded-xl border p-8 text-center transition-all hover:border-brand-green hover:shadow-lg"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-brand-green transition-transform group-hover:scale-110">
              <Icon className="h-10 w-10" />
            </span>
            <h3 className="text-lg font-semibold group-hover:text-brand-green">
              {t(`services.${key}`)}
            </h3>
          </Link>
        ))}
      </section>
    </>
  );
}
