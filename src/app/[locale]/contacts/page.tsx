import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { BannerTint } from "@/components/photo-tints";
// Static imports give each picture an automatic blur placeholder while it loads.
import contactsImage from "../../../../public/images/contacts.jpg";
import mapImage from "../../../../public/images/map.jpg";

// The agency's Google Maps place page.
const MAP_LINK =
  "https://www.google.com/maps/place/SCREEN+PRINTING+-+ADVERTISING-ACCENT/@42.4909515,27.4653886,17z/data=!3m1!4b1!4m6!3m5!1s0x40a694beba699433:0x27a38c0581088405!8m2!3d42.4909476!4d27.4679635!16s%2Fg%2F11dxdcg82t";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacts");

  // The phones are stored as one comma-separated string; each gets its own tel: link.
  const phones = t("phones")
    .split(",")
    .map((phone) => phone.trim())
    .filter(Boolean);
  const email = t("email");

  return (
    <>
      {/* Banner. bg-primary is the fallback colour until the photo (or its blur) paints. */}
      <section className="relative isolate overflow-hidden bg-primary text-white">
        <Image
          src={contactsImage}
          alt=""
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <BannerTint />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-pretty text-white/80 sm:text-lg">
              {t("intro")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact cards overlap the banner slightly. */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="relative z-10 -mt-10 grid gap-6 md:grid-cols-3">
          <ContactCard icon={<MapPin className="size-6" aria-hidden />} label={t("labels.address")}>
            <p className="leading-relaxed">{t("address")}</p>
          </ContactCard>

          <ContactCard icon={<Phone className="size-6" aria-hidden />} label={t("labels.phone")}>
            <ul className="space-y-1">
              {phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-primary hover:underline"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </ContactCard>

          <ContactCard icon={<Mail className="size-6" aria-hidden />} label={t("labels.email")}>
            <a
              href={`mailto:${email}`}
              className="break-all transition-colors hover:text-primary hover:underline"
            >
              {email}
            </a>
          </ContactCard>
        </div>

        {/* A static picture of the map, linking out to Google Maps. The live embed
            pulled in Google's scripts and only appeared a second or two late. */}
        <a
          href={MAP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mt-10 block overflow-hidden rounded-2xl border bg-muted shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Image
            src={mapImage}
            alt=""
            placeholder="blur"
            sizes="(min-width: 1200px) 1152px, 100vw"
            className="h-96 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-112"
          />
          <span className="absolute right-4 bottom-4 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-lg transition-colors group-hover:bg-primary/85">
            {t("openInMaps")}
            <ExternalLink className="size-4" aria-hidden />
          </span>
          {/* Google requires the attribution to stay visible on map screenshots. */}
          <span className="absolute bottom-1 left-2 text-xs text-neutral-600">
            Map data ©2026 Google
          </span>
        </a>
      </section>
    </>
  );
}

function ContactCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-lg">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary text-brand-green">
        {icon}
      </span>
      <p className="mt-4 text-sm font-semibold tracking-wide text-primary uppercase">
        {label}
      </p>
      <div className="mt-2 text-base text-muted-foreground">{children}</div>
    </div>
  );
}
