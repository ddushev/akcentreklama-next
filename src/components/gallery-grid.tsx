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

// A neutral 8x8 JPEG since Next can't generate a per-image blur the way it does for local files.
// This placeholder fills every tile immediately, so the grid fades in instead of popping in.
const PLACEHOLDER =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDABQODxIPDRQSERIXFhQYHzMhHxwcHz8tLyUzSkFOTUlBSEZSXHZkUldvWEZIZoxob3p9hIWET2ORm4+AmnaBhH//2wBDARYXFx8bHzwhITx/VEhUf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3//wAARCAAIAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDqaKKKBn//2Q==";

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
                placeholder={PLACEHOLDER}
                loading={i < 8 ? "eager" : "lazy"}
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
