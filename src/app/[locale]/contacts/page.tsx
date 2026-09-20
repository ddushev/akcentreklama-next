import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
// Static import gives the banner an automatic blur placeholder while it loads.
import contactsImage from "../../../../public/images/contacts.jpg";

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
        <div className="absolute inset-0 -z-10 bg-primary/85 md:bg-transparent md:bg-linear-to-r md:from-primary md:via-primary/85 md:to-primary/25" />

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

        <div className="mt-10 overflow-hidden rounded-2xl border bg-muted shadow-lg">
          <iframe
            title="map"
            className="block h-[24rem] w-full sm:h-[28rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=42.490929,27.468048&z=15&output=embed"
          />
        </div>
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
