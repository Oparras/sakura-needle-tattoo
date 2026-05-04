import { siteConfig } from "@/config/site";

export function BookingEmbed() {
  const isEmbedMode = siteConfig.booking.mode === "embed";
  const embedUrl = siteConfig.booking.embedUrl || siteConfig.booking.externalUrl;
  const referenceUrl = siteConfig.booking.externalUrl || siteConfig.booking.url;

  return (
    <div
      id="booking-embed"
      className="relative overflow-hidden rounded-[2rem] border border-soft-border bg-white p-4 shadow-[0_24px_70px_rgba(136,103,110,0.08)] sm:p-5"
    >
      <div className="petal-grid rounded-[1.5rem] border border-soft-border bg-warm-white p-4 sm:p-6">
        {isEmbedMode ? (
          <iframe
            src={embedUrl}
            title={siteConfig.booking.iframeTitle}
            className="h-[640px] w-full rounded-[1.4rem] border-0 bg-white"
            loading="lazy"
          />
        ) : (
          <div className="flex min-h-[19rem] flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-sakura-strong/60 bg-white/80 px-6 py-8 text-center sm:min-h-[24rem] sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
              BookingEmbed
            </p>
            <h3 className="mt-4 font-display text-3xl tracking-[-0.04em] text-foreground sm:text-4xl">
              Agenda preparada para integrarse aquí
            </h3>
            <p className="mt-4 max-w-md text-base leading-7 text-muted sm:leading-8">
              Mientras la reserva viva fuera de la landing, este bloque mantiene
              el espacio listo para mostrar la agenda dentro de la página cuando
              quieras activarla.
            </p>
            <p className="mt-6 max-w-full break-all rounded-2xl border border-soft-border bg-white px-4 py-2 text-sm text-muted">
              {referenceUrl}
            </p>
          </div>
        )}

        {
          /*
            Cuando quieras mostrar la agenda dentro de la landing, cambia el
            mode en src/config/appointment.ts:

            appointmentConfig = {
              bookingMode: "embed",
              externalBookingUrl: "https://...",
              embedUrl: "https://...",
            }
          */
        }
      </div>
    </div>
  );
}
