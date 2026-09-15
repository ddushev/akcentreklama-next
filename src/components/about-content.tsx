import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Car, Megaphone, Printer } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HomeCta } from "@/components/home-cta";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SERVICES = [
  { key: "screenPrinting", href: "/gallery/screen-printing", Icon: Printer },
  { key: "vehicleBranding", href: "/gallery/vehicle-branding", Icon: Car },
  { key: "outdoorAdvertising", href: "/gallery/outdoor-advertising", Icon: Megaphone },
] as const;

export async function AboutContent() {
  const t = await getTranslations("about");

  return (
    <>
      {/* Intro: text + the single agency photo. Stacks on mobile, side by side from lg. */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{t("titles.about")}</h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("about")}
          </p>
        </div>
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/about-agency.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <HomeCta />

      {/* Services: each card links to its gallery. */}
      <div className="bg-muted">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-10 sm:gap-6 sm:px-6 sm:py-16">
          {SERVICES.map(({ key, href, Icon }) => (
            <Link
              key={key}
              href={href}
              className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Card
                className="gap-4 text-base transition-all [--card-spacing:--spacing(6)] group-hover:shadow-lg group-hover:ring-brand-green sm:[--card-spacing:--spacing(8)]"
              >
                <CardHeader>
                  <CardTitle>
                    <h2 className="flex items-center gap-3 text-xl font-bold transition-colors group-hover:text-primary sm:text-2xl">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-brand-green transition-transform group-hover:scale-110">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      {t(`titles.${key}`)}
                    </h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed sm:text-lg">
                    {t(key)}
                  </CardDescription>
                  <span className="inline-flex items-center gap-2 font-semibold text-primary group-hover:underline">
                    {t("viewGallery")}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
