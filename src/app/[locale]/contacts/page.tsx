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
    <div className="mx-auto w-[90%] max-w-6xl py-12">
      <h1 className="mb-8 text-center text-2xl font-bold">{t("title")}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <ContactRow icon={<MapPin className="h-6 w-6 text-brand-green" />}>
            {t("address")}
          </ContactRow>
          <ContactRow icon={<Phone className="h-6 w-6 text-brand-green" />}>
            {t("phones")}
          </ContactRow>
          <ContactRow icon={<Mail className="h-6 w-6 text-brand-green" />}>
            <a href={`mailto:${t("email")}`} className="hover:text-brand-green">
              {t("email")}
            </a>
          </ContactRow>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <iframe
            title="map"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=42.490929,27.468048&z=15&output=embed"
          />
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      {icon}
      <span className="text-card-foreground">{children}</span>
    </div>
  );
}
