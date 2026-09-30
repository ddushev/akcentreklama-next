// Permanent redirects from the old static site's URLs, so existing links and
// search rankings carry over. The old server served every page both with and
// without `.html`, so both forms are covered (/about and /contacts still exist
// as-is, so only their .html forms need one).
//
// Applied in two places, because on Netlify the middleware runs at the edge
// before Next's own redirects:
//   * middleware.ts handles the extensionless paths, which the next-intl
//     middleware would otherwise rewrite to a missing /bg/... page and 404.
//   * next.config.ts handles the .html paths, which the middleware skips
//     (its matcher excludes anything with a file extension).
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/gallery-screen-printing": "/gallery/screen-printing",
  "/gallery-screen-printing.html": "/gallery/screen-printing",
  "/gallery-vehicle-branding": "/gallery/vehicle-branding",
  "/gallery-vehicle-branding.html": "/gallery/vehicle-branding",
  "/gallery-outside-branding": "/gallery/outdoor-advertising",
  "/gallery-outside-branding.html": "/gallery/outdoor-advertising",
  "/about.html": "/about",
  "/contacts.html": "/contacts",
  "/index.html": "/",
};
