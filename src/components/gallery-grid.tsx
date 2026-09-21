"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useTranslations } from "next-intl";
import { ImageOff } from "lucide-react";
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
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ImageOff className="size-7" aria-hidden />
        </span>
        <p className="text-muted-foreground">{t("empty")}</p>
      </div>
    );
  }

  const slides = images.map((img) => ({
    src: imageUrl(img.storage_path),
    alt: img.caption ?? "",
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            // bg-muted fills the tile while the photo loads, so the grid never flashes white.
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-border transition-shadow duration-200 hover:shadow-xl"
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              aria-label={img.caption ?? ""}
            >
              <Image
                src={imageUrl(img.storage_path)}
                alt={img.caption ?? ""}
                fill
                // The first row is likely on screen straight away; the rest stay lazy.
                preload={i < 4}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {img.caption && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3 text-left text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {img.caption}
                </span>
              )}
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
