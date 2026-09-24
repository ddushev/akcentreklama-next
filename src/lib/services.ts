// The three services, shared by the home cards, the About rows and the gallery
// nav. Swapping a photo or icon here updates every page at once.
//
// Kept apart from lib/gallery.ts on purpose: that module is imported by client
// components, and this one pulls in the service photos.

import type { StaticImageData } from "next/image";
import { Car, Megaphone, Printer, type LucideIcon } from "lucide-react";
import type { CategorySlug } from "@/lib/gallery";
import screenPrintingImage from "../../public/images/about-screen-printing.jpg";
import vehicleBrandingImage from "../../public/images/about-vehicle-branding.jpg";
import outdoorAdvertisingImage from "../../public/images/about-outdoor-advertising.jpg";

export interface Service {
  /** URL segment and the `category` stored on each image row. */
  slug: CategorySlug;
  /** Message key under `home.services`, `about.titles`, `gallery`, etc. */
  key: string;
  href: string;
  Icon: LucideIcon;
  image: StaticImageData;
}

export const SERVICES: readonly Service[] = [
  {
    slug: "screen-printing",
    key: "screenPrinting",
    href: "/gallery/screen-printing",
    Icon: Printer,
    image: screenPrintingImage,
  },
  {
    slug: "vehicle-branding",
    key: "vehicleBranding",
    href: "/gallery/vehicle-branding",
    Icon: Car,
    image: vehicleBrandingImage,
  },
  {
    slug: "outdoor-advertising",
    key: "outdoorAdvertising",
    href: "/gallery/outdoor-advertising",
    Icon: Megaphone,
    image: outdoorAdvertisingImage,
  },
];

export function getService(slug: CategorySlug): Service {
  // Every CategorySlug has an entry above, so this always finds one.
  return SERVICES.find((service) => service.slug === slug)!;
}
