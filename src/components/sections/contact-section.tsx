import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { PetalCluster } from "@/components/petal-cluster";
import { SakuraBranch } from "@/components/sakura-branch";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/config/site";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M7.75 3h8.5A4.75 4.75 0 0 1 21 7.75v8.5A4.75 4.75 0 0 1 16.25 21h-8.5A4.75 4.75 0 0 1 3 16.25v-8.5A4.75 4.75 0 0 1 7.75 3Zm0 1.5A3.25 3.25 0 0 0 4.5 7.75v8.5A3.25 3.25 0 0 0 7.75 19.5h8.5a3.25 3.25 0 0 0 3.25-3.25v-8.5A3.25 3.25 0 0 0 16.25 4.5h-8.5Zm8.9 1.6a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 3a9 9 0 0 1 7.83 13.44L21 21l-4.68-1.14A9 9 0 1 1 12 3Zm0 1.5a7.5 7.5 0 0 0-6.43 11.37l.22.36-.68 2.78 2.86-.7.34.2A7.5 7.5 0 1 0 12 4.5Zm4.33 9.4c-.24-.12-1.42-.7-1.64-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.95-1.22-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.41.08-.16.04-.31-.02-.43-.06-.12-.54-1.31-.74-1.8-.19-.46-.39-.4-.54-.41h-.46a.88.88 0 0 0-.63.29c-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.61.57.25 1.02.4 1.37.51.57.18 1.08.15 1.48.09.45-.07 1.42-.58 1.62-1.14.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 5.75A1.75 1.75 0 0 1 5.75 4h12.5A1.75 1.75 0 0 1 20 5.75v12.5A1.75 1.75 0 0 1 18.25 20H5.75A1.75 1.75 0 0 1 4 18.25V5.75Zm1.5.1v.2l6.5 5.2 6.5-5.2v-.2a.25.25 0 0 0-.25-.25H5.75a.25.25 0 0 0-.25.25Zm13 2.12-5.95 4.76a.88.88 0 0 1-1.1 0L5.5 7.97v10.28c0 .14.11.25.25.25h12.5c.14 0 .25-.11.25-.25V7.97Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 2.75a6.25 6.25 0 0 1 6.25 6.25c0 4.32-4.7 9.53-5.88 10.77a.5.5 0 0 1-.74 0C10.45 18.53 5.75 13.32 5.75 9A6.25 6.25 0 0 1 12 2.75Zm0 1.5A4.75 4.75 0 0 0 7.25 9c0 2.99 3.02 7.01 4.75 8.98C13.73 16.01 16.75 11.99 16.75 9A4.75 4.75 0 0 0 12 4.25Zm0 2.5A2.25 2.25 0 1 1 9.75 9 2.25 2.25 0 0 1 12 6.75Zm0 1.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

type ContactCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  href?: string;
};

function ContactCard({ icon, title, value, href }: ContactCardProps) {
  const content = (
    <div className="rounded-[1.6rem] border border-soft-border bg-white px-5 py-5 shadow-[0_16px_40px_rgba(136,103,110,0.05)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-sakura-strong/70 hover:shadow-[0_20px_44px_rgba(136,103,110,0.08)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sakura/35 text-foreground">
        {icon}
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.26em] text-muted">
        {title}
      </p>
      <p className="mt-3 text-base leading-7 text-foreground">{value}</p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}: ${value}`}
      className="block rounded-[1.6rem]"
    >
      {content}
    </a>
  );
}

export function ContactSection() {
  return (
    <section
      id="contacto"
      className="section-anchor relative overflow-hidden pb-24 pt-20"
    >
      <PetalCluster className="-left-10 top-10 hidden opacity-55 lg:block" />
      <SakuraBranch className="right-3 bottom-12 hidden opacity-38 xl:block" mirrored />

      <Container className="grid gap-10 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <SectionHeading
            eyebrow="Contacto"
            title="Un espacio cercano para consultar, conversar y reservar"
            description="Instagram, WhatsApp y email para que el contacto se sienta simple, directo y cuidado."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <ContactCard
              icon={<InstagramIcon />}
              title="Instagram"
              value={siteConfig.instagramLabel}
              href={siteConfig.instagramUrl}
            />
            <ContactCard
              icon={<WhatsappIcon />}
              title="WhatsApp"
              value={siteConfig.whatsappLabel}
              href={siteConfig.whatsappUrl}
            />
            <ContactCard
              icon={<MailIcon />}
              title="Email"
              value={siteConfig.email}
              href={`mailto:${siteConfig.email}`}
            />
            <ContactCard
              icon={<MapPinIcon />}
              title="Ciudad / Estudio"
              value={siteConfig.city}
            />
          </div>
        </div>

        <aside className="petal-grid rounded-[2rem] border border-soft-border bg-white/80 p-5 shadow-[0_24px_70px_rgba(136,103,110,0.07)] sm:p-6">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-soft-border bg-warm-white p-6">
            <SakuraBranch className="right-0 top-0 w-28 opacity-35" mirrored />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
              Antes de tu cita
            </p>
            <h3 className="mt-4 font-display text-3xl leading-[0.95] tracking-[-0.04em] text-foreground sm:text-4xl">
              Un cierre cálido, limpio y profesional
            </h3>
            <p className="mt-4 text-base leading-8 text-muted">
              Este espacio puede recoger horario, recordatorios de cita previa,
              cuidados o cualquier mensaje de confianza antes de reservar.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Cita previa y seguimiento personalizado.",
                "Espacio para condiciones de señal o política de cambios.",
                "Un último gesto de confianza antes de la reserva.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-soft-border bg-white px-4 py-3 text-sm leading-7 text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </Container>
    </section>
  );
}
