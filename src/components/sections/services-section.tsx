import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/config/landing-content";

export function ServicesSection() {
  return (
    <section
      id="servicios"
      className="section-anchor border-y border-soft-border/70 bg-white/55 py-20 sm:py-24"
    >
      <Container>
        <SectionHeading
          eyebrow="Servicios"
          title="Especialidades delicadas, limpias y pensadas para durar"
          description="Cada servicio está preparado para explicar el enfoque del estudio con un texto breve, claro y fácil de editar."
          align="center"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-[1.8rem] border border-soft-border bg-warm-white p-6 shadow-[0_18px_50px_rgba(136,103,110,0.05)] transition-transform duration-200 hover:-translate-y-1 hover:border-sakura-strong/70 hover:shadow-[0_22px_46px_rgba(136,103,110,0.09)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                {service.accent}
              </p>
              <h3 className="mt-5 font-display text-3xl leading-none tracking-[-0.04em] text-foreground">
                {service.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
