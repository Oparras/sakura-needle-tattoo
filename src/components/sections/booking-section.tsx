import { BookingEmbed } from "@/components/booking-embed";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PetalCluster } from "@/components/petal-cluster";
import { SakuraBranch } from "@/components/sakura-branch";
import { SectionHeading } from "@/components/section-heading";
import { bookingHighlights } from "@/config/landing-content";
import { type BookingMode, siteConfig } from "@/config/site";

export function BookingSection() {
  const isExternalBooking =
    (siteConfig.booking.mode as BookingMode) === "external";

  return (
    <section
      id="reservar"
      className="section-anchor relative overflow-hidden border-y border-soft-border/70 bg-white/60 py-20 sm:py-24"
    >
      <PetalCluster className="-left-10 bottom-4 hidden opacity-65 lg:block" />
      <PetalCluster className="right-0 top-10 hidden scale-[0.95] opacity-50 md:block" />
      <SakuraBranch className="right-2 bottom-10 hidden opacity-40 xl:block" mirrored />

      <Container className="grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <SectionHeading
            eyebrow="Reserva"
            title="Reserva tu cita y empecemos a dar forma a tu idea"
            description="La agenda puede abrirse en una nueva pestaña o integrarse aquí más adelante sin rehacer la sección."
          />

          <div className="mt-8 space-y-4">
            {bookingHighlights.map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-soft-border bg-warm-white px-5 py-4 text-sm leading-7 text-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:border-sakura-strong/70 hover:shadow-[0_16px_34px_rgba(136,103,110,0.08)]"
              >
                {item}
              </div>
            ))}
          </div>

          {isExternalBooking ? (
            <div className="mt-8 space-y-4">
              <ButtonLink
                href={siteConfig.booking.url}
                target="_blank"
                aria-label={`${siteConfig.booking.ctaLabel} en una nueva pestaña`}
              >
                {siteConfig.booking.ctaLabel}
              </ButtonLink>
              <p className="text-sm leading-7 text-muted">
                La reserva se abre en una nueva pestaña para mantener esta
                primera versión ligera, clara y fácil de actualizar.
              </p>
            </div>
          ) : (
            <p className="mt-8 rounded-2xl border border-soft-border bg-warm-white px-5 py-4 text-sm leading-7 text-muted">
              La agenda está integrada en esta sección y puede actualizarse
              directamente desde la URL de embed configurada.
            </p>
          )}
        </div>

        <BookingEmbed />
      </Container>
    </section>
  );
}
