"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "gallery", href: "/gallery/screen-printing" },
  { key: "contacts", href: "/contacts" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/"));

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur border-b-4 border-brand-green text-white">
      <div className="mx-auto flex w-[90%] max-w-6xl items-center justify-between py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-brand-green">
            {tBrand("name")}
          </span>
          <span className="hidden text-sm uppercase tracking-wide sm:inline">
            {tBrand("tagline")}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-bold uppercase transition-colors hover:text-brand-green",
                isActive(item.href) && "text-brand-green",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="ml-2 flex items-center">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            className="text-white hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-white/10 md:hidden">
          <div className="mx-auto flex w-[90%] max-w-6xl flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-3 text-sm font-bold uppercase transition-colors hover:text-brand-green",
                  isActive(item.href) && "text-brand-green",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
