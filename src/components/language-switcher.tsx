"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LABELS: Record<string, string> = {
  bg: "Български",
  en: "English",
  ru: "Русский",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("label")}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 hover:text-brand-green"
      >
        <Globe className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            disabled={loc === locale}
            onClick={() => router.replace(pathname, { locale: loc })}
          >
            {LABELS[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
