"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useTranslations } from "next-intl";
import type { CategorySlug, GalleryImage } from "@/lib/gallery";
import { imageUrl } from "@/lib/gallery-client";

export function GalleryGrid({
  images,
  isAdmin = false,
  category,
}: {
  images: GalleryImage[];
  isAdmin?: boolean;
  category: CategorySlug;
}) {
  const t = useTranslations("gallery");
  const [index, setIndex] = useState(-1);

  // Admin upload/delete controls are wired up in a later step; `isAdmin` and
  // `category` gate their rendering.
  void isAdmin;
  void category;

  if (images.length === 0) {
    return (
      <p className="py-20 text-center text-muted-foreground">{t("empty")}</p>
    );
  }

  const slides = images.map((img) => ({
    src: imageUrl(img.storage_path, { width: 1600, quality: 80 }),
    alt: img.caption ?? "",
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={imageUrl(img.storage_path, { width: 400, height: 400, quality: 70 })}
              alt={img.caption ?? ""}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </>
  );
}
