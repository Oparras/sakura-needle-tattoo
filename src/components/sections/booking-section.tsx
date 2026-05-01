import { BookingEmbed } from "@/components/booking-embed";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { bookingHighlights } from "@/config/landing-content";
import { type BookingMode, siteConfig } from "@/config/site";

export function BookingSection() {
  const isExternalBooking =
    (siteConfig.booking.mode as BookingMode) === "external";

  return (
    <section
      id="reservar"
      className="section-anchor border-y border-soft-border/70 bg-white/60 py-20 sm:py-24"
    >
      <Container className="grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <SectionHeading
            eyebrow="Reserva"
            title="Una llamada a la acción clara, suave y lista para convertir"
            description="La landing ya abre la plataforma externa en una nueva pestaña y deja preparado el espacio para integrar el calendario en la propia página."
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
                La reserva se abre en una nueva pestaña para mantener la landing
                ligera en esta primera publicación.
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
