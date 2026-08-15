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
    <div className="flex min-h-[calc(100vh-6.5rem)] w-full flex-col">
      {/* Full-bleed image area filling the space above the buttons. */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {TABS.map((tab) => (
          <div
            key={tab}
            aria-hidden={tab !== active}
            className={cn(
              "flex items-center transition-opacity duration-700 ease-in-out",
              tab === active
                ? "relative flex-1 opacity-100"
                : "absolute inset-0 pointer-events-none opacity-0",
            )}
          >
            <Image
              src={TAB_IMAGE[tab]}
              alt=""
              fill
              sizes="100vw"
              priority={tab === "about"}
              className="object-cover"
            />
            {/* Dark overlay so the text stays readable over the photo. */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative mx-auto max-w-5xl px-6 py-10 text-center text-white">
              {/* Visually-hidden page heading for SEO / screen readers. */}
              <h1 className="sr-only">{t(`tabs.${tab}`)}</h1>
              <p className="text-2xl leading-relaxed sm:text-3xl md:text-4xl">
                {t(tab)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab buttons below the image, above the footer (like the old site). */}
      <div className="flex flex-wrap justify-center gap-2 bg-primary p-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active === tab
                ? "bg-brand-green text-primary"
                : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
