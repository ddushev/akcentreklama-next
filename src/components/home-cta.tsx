"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function HomeCta() {
  const t = useTranslations("home");

  return (
    <section className="bg-primary/90 py-4 text-center text-white">
      <h2 className="text-xl font-bold">
        {t.rich("ctaText", {
          link: (chunks) => (
            <Link href="/contacts" className="text-brand-green hover:text-white">
              {chunks}
            </Link>
          ),
        })}
      </h2>
    </section>
  );
}
