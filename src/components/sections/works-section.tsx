import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { portfolioItems, type PortfolioItem } from "@/config/landing-content";
import { siteConfig } from "@/config/site";

function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-soft-border bg-white shadow-[0_18px_50px_rgba(136,103,110,0.06)] transition-transform duration-200 hover:-translate-y-1 hover:border-sakura-strong/70 hover:shadow-[0_24px_60px_rgba(136,103,110,0.09)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.alt ?? item.title}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          />
        ) : (
          <div className="petal-grid flex h-full items-end bg-warm-white p-6">
            <div className="rounded-[1.4rem] border border-dashed border-sakura-strong/60 bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">
                Placeholder
              </p>
              <h3 className="mt-3 font-display text-3xl leading-none tracking-[-0.04em] text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{item.caption}</p>
            </div>
          </div>
        )}

        {
          /*
            Si en el futuro quieres soportar embeds de Instagram, puedes usar
            item.instagramEmbedUrl en este mismo bloque para renderizar el script
            oficial o un iframe encapsulado.
          */
        }
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div>
          <p className="font-medium text-foreground">{item.title}</p>
          <p className="mt-1 text-sm text-muted">{item.caption}</p>
        </div>
        <span className="rounded-full border border-soft-border bg-warm-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          {item.tag}
        </span>
      </div>
    </article>
  );
}

export function WorksSection() {
  return (
    <section id="trabajos" className="section-anchor py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Trabajos / Instagram"
          title="Una cuadrícula visual preparada para crecer contigo"
          description="Empieza con placeholders elegantes y sustituye cada tarjeta por fotografías reales o futuros embeds de Instagram sin rehacer la sección."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {portfolioItems.map((item) => (
            <PortfolioCard key={item.title} item={item} />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:justify-start">
          <ButtonLink
            href={siteConfig.instagramUrl}
            target="_blank"
            aria-label={`Ver más trabajos en Instagram: ${siteConfig.instagramLabel}`}
            variant="secondary"
          >
            Ver más en Instagram
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
