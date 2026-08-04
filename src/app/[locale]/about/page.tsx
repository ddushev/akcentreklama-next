import { setRequestLocale } from "next-intl/server";
import { AboutTabs } from "@/components/about-tabs";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutTabs />;
}
