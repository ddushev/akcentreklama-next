import { getTranslations } from "next-intl/server";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";

export async function ContactCta() {
  const t = await getTranslations("home");
  const tContacts = await getTranslations("contacts");

  const phone = tContacts("phones").split(",")[0].trim();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-12 text-white sm:px-12 sm:py-16">
        <div
          className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-brand-green/30 blur-3xl"
          aria-hidden
        />
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/80">{t("ctaBody")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contacts"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-green px-6 font-semibold text-primary transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("contactUs")}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 font-semibold whitespace-nowrap transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Phone className="size-4" aria-hidden />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
