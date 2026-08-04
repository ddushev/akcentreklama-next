import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Акцент — Ситопечат и реклама",
  description:
    "Професионална реклама и дизайн за вашия бизнес. Собствена печатница.",
  icons: { icon: "/favicon.png" },
};

// The root layout is intentionally minimal; the real <html>/<body> live in
// the [locale] layout so we can set the correct `lang` attribute per locale.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
