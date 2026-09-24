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
