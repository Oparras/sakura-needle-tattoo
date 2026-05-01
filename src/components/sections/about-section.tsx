import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { aboutContent } from "@/config/landing-content";

export function AboutSection() {
  return (
    <section id="sobre-mi" className="section-anchor py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="order-2 lg:order-1">
          <SectionHeading
            eyebrow={aboutContent.eyebrow}
            title={aboutContent.title}
            description={aboutContent.intro}
          />

          <div className="mt-8 space-y-5 text-base leading-8 text-muted">
            {aboutContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {aboutContent.highlights.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-soft-border bg-white/75 px-5 py-4 text-sm leading-7 text-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:border-sakura-strong/70 hover:shadow-[0_16px_34px_rgba(136,103,110,0.08)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-md">
            <div className="absolute inset-x-8 top-8 h-full rounded-[2rem] bg-sakura/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-soft-border bg-white p-4 shadow-[0_22px_70px_rgba(152,115,122,0.08)]">
              <div className="petal-grid flex aspect-[4/5] items-end rounded-[1.6rem] border border-dashed border-sakura-strong/60 bg-warm-white p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    Placeholder editable
                  </p>
                  <h3 className="mt-4 font-display text-4xl leading-none tracking-[-0.04em] text-foreground">
                    {aboutContent.imageTitle}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-muted">
                    {aboutContent.imageDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
