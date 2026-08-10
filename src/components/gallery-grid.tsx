"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useTranslations } from "next-intl";
import type { CategorySlug, GalleryImage } from "@/lib/gallery";
import { imageUrl } from "@/lib/gallery-client";
import { DeleteImageButton, UploadZone } from "@/components/gallery-admin";

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

  // New uploads append after the current highest position.
  const nextPosition =
    images.reduce((max, img) => Math.max(max, img.position), -1) + 1;

  // No images and not admin → the public empty state.
  if (images.length === 0 && !isAdmin) {
    return (
      <p className="py-20 text-center text-muted-foreground">{t("empty")}</p>
    );
  }

  const slides = images.map((img) => ({
    src: imageUrl(img.storage_path),
    alt: img.caption ?? "",
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="absolute inset-0 h-full w-full"
              aria-label={img.caption ?? ""}
            >
              <Image
                src={imageUrl(img.storage_path)}
                alt={img.caption ?? ""}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </button>
            {isAdmin && <DeleteImageButton image={img} />}
          </div>
        ))}

        {isAdmin && (
          <UploadZone category={category} nextPosition={nextPosition} />
        )}
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
