"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  STORAGE_BUCKET,
  type CategorySlug,
  type GalleryImage,
} from "@/lib/gallery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Turns an original filename into a safe, lowercase storage-path stem. */
function slugifyFileName(name: string): string {
  const stem = name.replace(/\.[^.]+$/, "");
  const slug = stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "image";
}

/** File extension (lowercased) or a sensible default from the MIME type. */
function extensionFor(file: File): string {
  const match = file.name.match(/\.([^.]+)$/);
  if (match) return match[1].toLowerCase();
  return file.type === "image/png" ? "png" : "jpg";
}

/**
 * Delete control overlaid on a gallery thumbnail (admin only). Revealed on
 * hover; opens a confirmation dialog, then removes the storage object and the
 * DB row and refreshes the server-rendered grid.
 */
export function DeleteImageButton({ image }: { image: GalleryImage }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([image.storage_path]);
    if (storageError) {
      toast.error(storageError.message);
      setDeleting(false);
      return;
    }

    const { error: dbError } = await supabase
      .from("images")
      .delete()
      .eq("id", image.id);
    if (dbError) {
      toast.error(dbError.message);
      setDeleting(false);
      return;
    }

    toast.success(t("deleted"));
    setDeleting(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        aria-label={t("delete")}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="absolute top-1.5 right-1.5 z-10 grid size-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-destructive focus-visible:opacity-100 group-hover:opacity-100"
      >
        <X className="size-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="px-2">{t("confirmDelete")}</DialogTitle>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Drag-and-drop (or click-to-select) multi-file upload tile (admin only).
 * Uploads each file to Storage and inserts a metadata row, appending new
 * images after the current last position.
 */
export function UploadZone({
  category,
  nextPosition,
}: {
  category: CategorySlug;
  nextPosition: number;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[], rejected: { file: File }[]) => {
      if (rejected.length > 0) {
        toast.error(`${rejected.length} file(s) skipped — images only.`);
      }
      if (accepted.length === 0) return;

      setUploading(true);
      const toastId = toast.loading(t("uploading"));
      let ok = 0;

      for (let i = 0; i < accepted.length; i++) {
        const file = accepted[i];
        const stem = slugifyFileName(file.name);
        const suffix = crypto.randomUUID().slice(0, 8);
        const path = `${category}/${stem}-${suffix}.${extensionFor(file)}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, file, { contentType: file.type, upsert: false });
        if (uploadError) {
          toast.error(`${file.name}: ${uploadError.message}`);
          continue;
        }

        const { error: dbError } = await supabase.from("images").insert({
          category,
          storage_path: path,
          position: nextPosition + i,
        });
        if (dbError) {
          // Roll back the orphaned object so storage and DB stay in sync.
          await supabase.storage.from(STORAGE_BUCKET).remove([path]);
          toast.error(`${file.name}: ${dbError.message}`);
          continue;
        }

        ok++;
      }

      setUploading(false);
      if (ok > 0) {
        toast.success(`${ok} image(s) uploaded.`, { id: toastId });
        router.refresh();
      } else {
        toast.dismiss(toastId);
      }
    },
    [supabase, category, nextPosition, router, t],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
    multiple: true,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-3 text-center text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
        isDragActive && "border-primary bg-primary/5 text-foreground",
        uploading && "pointer-events-none opacity-70",
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <Loader2 className="size-6 animate-spin" />
      ) : (
        <ImagePlus className="size-6" />
      )}
      <span>{uploading ? t("uploading") : t("upload")}</span>
    </div>
  );
}
