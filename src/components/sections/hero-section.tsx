import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PetalCluster } from "@/components/petal-cluster";
import { SakuraBranch } from "@/components/sakura-branch";
import { SakuraDivider } from "@/components/sakura-divider";
import { heroContent } from "@/config/landing-content";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  const bookingTarget = siteConfig.booking.opensInNewTab ? "_blank" : undefined;
  const bookingAriaLabel = siteConfig.booking.opensInNewTab
    ? `${siteConfig.booking.ctaLabel} en una nueva pestaña`
    : `${siteConfig.booking.ctaLabel} en esta página`;

  return (
    <section
      id="inicio"
      className="section-anchor relative overflow-hidden pb-12 pt-14 sm:pb-16 sm:pt-[4.25rem] lg:pb-[4.2rem] lg:pt-[4.75rem]"
    >
      <PetalCluster className="-left-8 top-8 hidden opacity-68 sm:block" />
      <PetalCluster className="right-0 top-[4.25rem] hidden scale-[1.02] opacity-52 sm:block" />
      <SakuraBranch className="-left-6 top-28 hidden opacity-42 lg:block" />
      <SakuraBranch className="right-2 top-28 hidden opacity-38 xl:block" mirrored />

      <Container className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-11 xl:gap-13">
        <div className="relative z-10 max-w-[19.5rem] sm:max-w-2xl">
          <p className="inline-flex items-center rounded-full border border-soft-border bg-white/82 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-muted">
            {heroContent.badge}
          </p>
          <h1 className="mt-5 max-w-[11ch] font-display text-[3.45rem] leading-[0.9] tracking-[-0.055em] text-foreground text-balance sm:mt-6 sm:max-w-[10ch] sm:text-[4.55rem] lg:max-w-none lg:text-[5.2rem] xl:text-[5.55rem]">
            {heroContent.title}
          </h1>
          <p className="mt-4 text-[0.8rem] uppercase tracking-[0.22em] text-muted sm:mt-5 sm:text-sm sm:tracking-[0.28em] lg:text-[0.94rem]">
            {heroContent.subtitle}
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:mt-6 sm:text-lg sm:leading-8">
            {heroContent.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={siteConfig.booking.url}
              target={bookingTarget}
              aria-label={bookingAriaLabel}
              className="w-full sm:w-auto"
            >
              {siteConfig.booking.ctaLabel}
            </ButtonLink>
            <ButtonLink
              href="#trabajos"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Ver trabajos
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[20.5rem] sm:max-w-[27rem] lg:max-w-[28rem]">
          <div className="absolute inset-x-10 top-10 h-full rounded-[2rem] bg-sakura/22 blur-3xl" />
          <SakuraBranch className="-right-6 bottom-16 z-0 hidden opacity-43 sm:block" />
          <div className="relative overflow-hidden rounded-[2rem] border border-soft-border bg-white/88 p-3 shadow-[0_24px_64px_rgba(152,115,122,0.1)] sm:rounded-[2.2rem] sm:p-4 sm:shadow-[0_30px_80px_rgba(152,115,122,0.12)]">
            <div className="rounded-[1.55rem] border border-soft-border bg-warm-white p-3 sm:rounded-[1.8rem]">
              <Image
                src={siteConfig.logoSrc}
                alt={siteConfig.logoAlt}
                width={1024}
                height={1024}
                priority
                className="h-auto w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </Container>

      <SakuraDivider className="mt-12 sm:mt-14" />
    </section>
  );
}
