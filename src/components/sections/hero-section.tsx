import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PetalCluster } from "@/components/petal-cluster";
import { heroContent } from "@/config/landing-content";
import { siteConfig } from "@/config/site";

const heroHighlights = [
  "Trato cercano",
  "Espacio sereno",
  "Detalle cuidado",
] as const;

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="section-anchor relative overflow-hidden pb-14 pt-14 sm:pb-18 sm:pt-20 lg:pb-22 lg:pt-24"
    >
      <PetalCluster className="-left-8 top-8 hidden sm:block" />
      <PetalCluster className="right-0 top-20 hidden scale-[1.1] opacity-60 sm:block" />

      <Container className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
        <div className="relative z-10 max-w-[18.9rem] sm:max-w-2xl">
          <p className="inline-flex items-center rounded-full border border-soft-border bg-white/80 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-muted">
            {heroContent.badge}
          </p>
          <h1 className="mt-5 max-w-[11ch] font-display text-[3.5rem] leading-[0.9] tracking-[-0.055em] text-foreground text-balance sm:mt-6 sm:max-w-[10ch] sm:text-[4.75rem] lg:max-w-none lg:text-[6.35rem]">
            {heroContent.title}
          </h1>
          <p className="mt-4 text-[0.8rem] uppercase tracking-[0.22em] text-muted sm:mt-5 sm:text-sm sm:tracking-[0.28em] lg:text-base">
            {heroContent.subtitle}
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:mt-6 sm:text-lg sm:leading-8">
            {heroContent.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={siteConfig.booking.url}
              target="_blank"
              aria-label={`${siteConfig.booking.ctaLabel} en una nueva pestaña`}
              className="w-full sm:w-auto"
            >
              {siteConfig.booking.ctaLabel}
            </ButtonLink>
            <ButtonLink href="#trabajos" variant="secondary" className="w-full sm:w-auto">
              Ver trabajos
            </ButtonLink>
          </div>

          <div className="mt-7 hidden flex-wrap gap-3 min-[480px]:flex">
            {heroHighlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-soft-border bg-white/72 px-4 py-2 text-sm text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[21.5rem] sm:max-w-[28rem]">
          <div className="absolute inset-x-8 top-8 h-full rounded-[2rem] bg-sakura/24 blur-3xl" />
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
            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:mt-5 sm:gap-3">
              {["Delicadeza", "Diseño propio", "Cita previa"].map((label) => (
                <div
                  key={label}
                  className="rounded-[1.1rem] border border-soft-border bg-white px-3 py-2.5 text-center text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted sm:rounded-[1.2rem] sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.22em]"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
