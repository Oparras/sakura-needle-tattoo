import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PetalCluster } from "@/components/petal-cluster";
import { SectionHeading } from "@/components/section-heading";
import { portfolioConfig, type PortfolioItem } from "@/config/portfolio";
import { cn } from "@/lib/utils";

type PortfolioCardProps = {
  item: PortfolioItem;
  featured?: boolean;
  compact?: boolean;
};

function PortfolioCard({
  item,
  featured = false,
  compact = false,
}: PortfolioCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-soft-border bg-white shadow-[0_18px_50px_rgba(136,103,110,0.06)] transition-transform duration-200 hover:-translate-y-1 hover:border-sakura-strong/70 hover:shadow-[0_24px_60px_rgba(136,103,110,0.09)]">
      <div
        className={cn(
          "relative overflow-hidden",
          featured
            ? "aspect-[4/5] sm:aspect-[6/5] lg:min-h-[38rem]"
            : compact
              ? "aspect-[4/5] sm:aspect-[3/4]"
              : "aspect-[4/5]",
        )}
      >
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes={
              featured
                ? "(min-width: 1280px) 55vw, (min-width: 768px) 58vw, 100vw"
                : "(min-width: 1280px) 26vw, (min-width: 768px) 46vw, 100vw"
            }
          />
        ) : (
          <div className="petal-grid relative h-full w-full bg-warm-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,199,205,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(231,174,184,0.16),transparent_26%)]" />
            <div className="absolute right-5 top-5 h-16 w-16 rounded-full border border-white/70 bg-white/55 blur-[1px]" />
            <div className="absolute left-5 top-5 rounded-full border border-soft-border bg-white/80 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">
              {featured ? "Imagen destacada" : "Portfolio"}
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

        <div className="absolute inset-x-4 bottom-4 rounded-[1.45rem] border border-white/65 bg-[rgba(255,253,252,0.88)] p-4 backdrop-blur-sm sm:inset-x-5 sm:bottom-5 sm:p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-muted">
            {featured ? "Selección principal" : "Sakura Needle Tattoo"}
          </p>
          <h3
            className={cn(
              "mt-3 font-display tracking-[-0.04em] text-foreground",
              featured
                ? "text-4xl leading-[0.9] sm:text-[2.7rem]"
                : "text-3xl leading-none",
            )}
          >
            {item.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted sm:text-[0.95rem]">
            {item.caption}
          </p>
        </div>
      </div>
    </article>
  );
}

function ExternalPortfolioPanel() {
  return (
    <div className="mt-14 overflow-hidden rounded-[2rem] border border-soft-border bg-white/80 p-5 shadow-[0_22px_60px_rgba(136,103,110,0.07)] sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="petal-grid flex min-h-[24rem] items-end rounded-[1.7rem] border border-dashed border-sakura-strong/60 bg-warm-white p-6 sm:min-h-[29rem]">
          <div className="max-w-md rounded-[1.5rem] border border-soft-border bg-white/80 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
              Instagram
            </p>
            <h3 className="mt-4 font-display text-4xl leading-[0.92] tracking-[-0.05em] text-foreground">
              Un escaparate ligero y listo para crecer
            </h3>
            <p className="mt-4 text-base leading-8 text-muted">
              Si prefieres mantener solo el perfil de Instagram, esta sección ya
              está preparada para hacerlo con una presencia limpia y elegante.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {portfolioConfig.items.slice(0, 3).map((item) => (
            <div
              key={item.title}
              className="rounded-[1.6rem] border border-soft-border bg-warm-white p-5 shadow-[0_16px_34px_rgba(136,103,110,0.05)]"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-muted">
                Placeholder
              </p>
              <h4 className="mt-3 font-display text-3xl leading-none tracking-[-0.04em] text-foreground">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-muted">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorksSection() {
  const [featuredItem, ...remainingItems] = portfolioConfig.items;
  const sideItems = remainingItems.slice(0, 2);
  const bottomItems = remainingItems.slice(2);
  const isManualMode = portfolioConfig.mode === "manual";

  return (
    <section
      id="trabajos"
      className="section-anchor relative overflow-hidden border-y border-soft-border/70 bg-white/45 py-20 sm:py-24"
    >
      <PetalCluster className="-right-8 top-12 hidden scale-[0.92] opacity-55 md:block" />
      <Container>
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Trabajos / Instagram"
            title="Una galería pensada para mostrar la marca con presencia"
            description="Empieza con esta composición limpia y sustituye cada bloque por imágenes reales cuando quieras, o deja solo el acceso a Instagram."
            className="max-w-3xl"
          />

          <ButtonLink
            href={portfolioConfig.instagramUrl}
            target="_blank"
            aria-label={`Ver más trabajos en Instagram: ${portfolioConfig.instagramLabel}`}
            variant="secondary"
            className="self-start lg:self-auto"
          >
            Ver más en Instagram
          </ButtonLink>
        </div>

        {isManualMode && featuredItem ? (
          <>
            <div className="mt-14 grid gap-5 lg:grid-cols-[1.22fr_0.78fr]">
              <PortfolioCard item={featuredItem} featured />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {sideItems.map((item) => (
                  <PortfolioCard key={item.title} item={item} compact />
                ))}
              </div>
            </div>

            {bottomItems.length > 0 ? (
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                {bottomItems.map((item) => (
                  <PortfolioCard key={item.title} item={item} />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <ExternalPortfolioPanel />
        )}
      </Container>
    </section>
  );
}
