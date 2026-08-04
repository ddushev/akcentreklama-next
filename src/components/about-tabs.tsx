"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const TABS = [
  "about",
  "screenPrinting",
  "vehicleBranding",
  "outdoorAdvertising",
] as const;

export function AboutTabs() {
  const t = useTranslations("about");
  const [active, setActive] = useState<(typeof TABS)[number]>("about");

  return (
    <div className="mx-auto w-[90%] max-w-4xl py-12">
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active === tab
                ? "bg-primary text-white"
                : "bg-muted hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-8 text-lg leading-relaxed text-card-foreground">
        {t(active)}
      </div>
    </div>
  );
}
