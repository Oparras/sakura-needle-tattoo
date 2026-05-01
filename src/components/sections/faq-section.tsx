import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/config/landing-content";

export function FaqSection() {
  return (
    <section id="faq" className="section-anchor py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Respuestas breves para resolver las dudas más habituales"
          description="El acordeón está listo para editar políticas, tiempos, señal o recomendaciones antes de publicar la web."
          align="center"
        />

        <div className="mx-auto mt-14 max-w-4xl space-y-4">
          {faqs.map((item, index) => (
            <details
              key={item.question}
              className="faq-item rounded-[1.6rem] border border-soft-border bg-white px-5 py-5 shadow-[0_16px_40px_rgba(136,103,110,0.05)] transition-colors hover:border-sakura-strong/70 sm:px-6"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-display text-2xl leading-[0.95] tracking-[-0.04em] text-foreground sm:text-3xl">
                  {item.question}
                </span>
                <span className="faq-icon text-3xl leading-none text-muted">+</span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
