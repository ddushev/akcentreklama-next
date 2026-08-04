import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bg", "en", "ru"],
  defaultLocale: "bg",
  // Bulgarian (default) has no prefix (/about); EN/RU are prefixed (/en/about).
  localePrefix: "as-needed",
});
