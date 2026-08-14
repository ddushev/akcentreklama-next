"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const TABS = [
  "about",
  "screenPrinting",
  "vehicleBranding",
  "outdoorAdvertising",
] as const;

// Background photo per tab (brought over from the original site).
const TAB_IMAGE: Record<(typeof TABS)[number], string> = {
  about: "/images/about-agency.jpg",
  screenPrinting: "/images/about-screen-printing.jpg",
  vehicleBranding: "/images/about-vehicle-branding.jpg",
  outdoorAdvertising: "/images/about-outdoor-advertising.jpg",
};

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

      <div className="relative min-h-104 overflow-hidden rounded-xl border sm:min-h-128">
        {TABS.map((tab) => (
          <div
            key={tab}
            aria-hidden={tab !== active}
            className={cn(
              "absolute inset-0 flex items-center transition-opacity duration-700 ease-in-out",
              tab === active ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Image
              src={TAB_IMAGE[tab]}
              alt=""
              fill
              sizes="(max-width: 896px) 90vw, 896px"
              className="object-cover"
            />
            {/* Dark overlay so the text stays readable over the photo. */}
            <div className="absolute inset-0 bg-black/60" />
            <p className="relative mx-auto max-w-3xl p-8 text-center text-xl leading-relaxed text-white sm:text-2xl">
              {t(tab)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
