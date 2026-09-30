import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

// Permanent redirects from the old static site's URLs, so existing links and
// search rankings carry over. The old server served every page both with and
// without `.html`, so both forms are covered (/about and /contacts still exist
// as-is, so only their .html forms need one).
//
// These live here rather than in netlify.toml: the next-intl middleware runs
// before Netlify's redirect rules and 404s the old paths first, while Next
// applies its own redirects before the middleware.
const OLD_SITE_REDIRECTS: [source: string, destination: string][] = [
  ["/gallery-screen-printing", "/gallery/screen-printing"],
  ["/gallery-screen-printing.html", "/gallery/screen-printing"],
  ["/gallery-vehicle-branding", "/gallery/vehicle-branding"],
  ["/gallery-vehicle-branding.html", "/gallery/vehicle-branding"],
  ["/gallery-outside-branding", "/gallery/outdoor-advertising"],
  ["/gallery-outside-branding.html", "/gallery/outdoor-advertising"],
  ["/about.html", "/about"],
  ["/contacts.html", "/contacts"],
  ["/index.html", "/"],
];

const nextConfig: NextConfig = {
  async redirects() {
    // `permanent` sends 308, which search engines treat like a 301.
    return OLD_SITE_REDIRECTS.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/**" }]
      : [],
    // Keep optimized copies for a year, matching the Cache-Control we set on upload.
    // Safely cache for a year because we never overwrite an existing storage object.
    minimumCacheTTL: 31536000,
  },
};

export default withNextIntl(nextConfig);
