import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { processSteps } from "@/config/landing-content";

export function ProcessSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Proceso"
          title="Un recorrido claro y sereno desde la idea hasta el cuidado final"
          description="Cuatro pasos simples para entender la experiencia de principio a fin."
          align="center"
        />

        <div className="relative mt-14 grid gap-5 xl:grid-cols-4">
          <div className="absolute left-24 right-24 top-8 hidden h-px bg-soft-border xl:block" />
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              className="relative rounded-[1.8rem] border border-soft-border bg-white p-6 shadow-[0_18px_50px_rgba(136,103,110,0.05)] transition-transform duration-200 hover:-translate-y-1 hover:border-sakura-strong/70 hover:shadow-[0_22px_46px_rgba(136,103,110,0.09)]"
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-sakura-strong/70 bg-sakura/35 text-sm font-semibold text-foreground">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-6 font-display text-3xl leading-none tracking-[-0.04em] text-foreground">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
