/**
 * Brand-purple wash laid over a photo, the same treatment the hero gets.
 * Place it inside a `relative` container, after the image.
 */
export function BrandTint() {
  return (
    <span
      className="absolute inset-0 bg-linear-to-b from-primary/80 to-primary/40"
      aria-hidden
    />
  );
}

/**
 * Tint for full-width banners with text on the left (home hero, contacts).
 * Solid on mobile so the text stays readable; from md it fades from the text
 * side so the photo shows through on the right. Needs an `isolate` parent.
 */
export function BannerTint() {
  return (
    <div
      className="absolute inset-0 -z-10 bg-primary/85 md:bg-transparent md:bg-linear-to-r md:from-primary md:via-primary/85 md:to-primary/25"
      aria-hidden
    />
  );
}
