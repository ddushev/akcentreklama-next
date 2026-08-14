import { setRequestLocale, getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail } from "lucide-react";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacts");

  return (
    <section className="pb-16">
      {/* Full-width image band. */}
      <div
        className="h-72 w-full bg-cover bg-center sm:h-96"
        style={{ backgroundImage: "url(/images/contacts.jpg)" }}
      />

      {/* White card overlapping the lower part of the image. */}
      <div className="mx-auto -mt-40 w-[90%] max-w-2xl rounded-xl bg-white text-neutral-900 shadow-xl sm:-mt-48">
        <div className="flex flex-col items-center gap-6 px-6 py-10 text-center">
          <h1 className="text-2xl font-bold italic">{t("title")}</h1>

          <ContactItem icon={<MapPin className="h-7 w-7 text-brand-green" />}>
            {t("address")}
          </ContactItem>
          <ContactItem icon={<Phone className="h-7 w-7 text-brand-green" />}>
            {t("phones")}
          </ContactItem>
          <ContactItem icon={<Mail className="h-7 w-7 text-brand-green" />}>
            <a href={`mailto:${t("email")}`} className="hover:text-brand-green">
              {t("email")}
            </a>
          </ContactItem>
        </div>

        <div className="overflow-hidden rounded-b-xl">
          <iframe
            title="map"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=42.490929,27.468048&z=15&output=embed"
          />
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {icon}
      <span className="italic">{children}</span>
    </div>
  );
}
