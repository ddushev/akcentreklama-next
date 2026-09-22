import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
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
