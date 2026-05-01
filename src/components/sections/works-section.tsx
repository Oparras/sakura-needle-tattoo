import { existsSync } from "node:fs";
import { join } from "node:path";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { InstagramFeaturedEmbed } from "@/components/instagram-featured-embed";
import { PetalCluster } from "@/components/petal-cluster";
import { SakuraBranch } from "@/components/sakura-branch";
import { SectionHeading } from "@/components/section-heading";
import { WorkCardMedia } from "@/components/work-card-media";
import { portfolioConfig, type PortfolioItem } from "@/config/portfolio";
import { cn } from "@/lib/utils";

type ResolvedPortfolioItem = PortfolioItem & {
  hasImage: boolean;
};

type WorkCardProps = {
  item: ResolvedPortfolioItem;
  featured?: boolean;
};

function hasLocalImage(src: string) {
  const normalized = src.replace(/^\/+/, "");
  return existsSync(join(process.cwd(), "public", normalized));
}

function WorkCard({ item, featured = false }: WorkCardProps) {
  const mediaHasImage = item.hasImage;

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir ${item.type} de Instagram: ${item.title}`}
      className={cn(
        "group relative block overflow-hidden rounded-[1.8rem] border border-soft-border bg-white shadow-[0_18px_50px_rgba(136,103,110,0.06)] transition-transform duration-200 hover:-translate-y-1 hover:border-sakura-strong/70 hover:shadow-[0_24px_60px_rgba(136,103,110,0.09)]",
        featured && "min-[520px]:col-span-2",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          featured
            ? "aspect-[5/6] min-[520px]:aspect-[16/11] xl:aspect-[16/10]"
            : "aspect-[5/6] sm:aspect-[4/5]",
        )}
      >
        <WorkCardMedia
          src={item.image}
          alt={item.alt}
          title={item.title}
          hasImage={mediaHasImage}
          sizes={
            featured
              ? "(min-width: 1280px) 50vw, (min-width: 520px) 100vw, 100vw"
              : "(min-width: 1280px) 24vw, (min-width: 640px) 48vw, 100vw"
          }
        />

        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            mediaHasImage
              ? "bg-[linear-gradient(180deg,rgba(20,18,18,0.04),rgba(20,18,18,0.3))] opacity-85 group-hover:opacity-100"
              : "bg-[linear-gradient(180deg,rgba(255,253,252,0.02),rgba(31,30,30,0.14))] opacity-75 group-hover:opacity-95",
          )}
        />

        <div
          className={cn(
            "absolute left-4 top-4 rounded-full border px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] backdrop-blur-sm",
            mediaHasImage
              ? "border-white/55 bg-[rgba(255,253,252,0.18)] text-white"
              : "border-white/65 bg-[rgba(255,253,252,0.84)] text-foreground",
          )}
        >
          {item.type === "reel" ? "Reel" : "Post"}
        </div>

        <div
          className={cn(
            "absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-[1.3rem] border px-4 py-3 backdrop-blur-sm",
            mediaHasImage
              ? "border-white/28 bg-[rgba(255,253,252,0.14)]"
              : "border-white/65 bg-[rgba(255,253,252,0.84)]",
          )}
        >
          <div className="min-w-0">
            <p
              className={cn(
                "text-[0.66rem] font-semibold uppercase tracking-[0.24em]",
                mediaHasImage ? "text-white/80" : "text-muted",
              )}
            >
              Instagram
            </p>
            <h3
              className={cn(
                "mt-2 truncate font-display leading-none tracking-[-0.04em]",
                featured ? "text-[2.15rem] sm:text-[2.35rem]" : "text-[1.95rem]",
                mediaHasImage ? "text-white" : "text-foreground",
              )}
            >
              {item.title}
            </h3>
          </div>
          <span
            className={cn(
              "shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-transform duration-200 group-hover:translate-x-0.5",
              mediaHasImage ? "text-white" : "text-foreground",
            )}
          >
            Ver
          </span>
        </div>
      </div>
    </a>
  );
}

function ExternalPortfolioPanel({ items }: { items: ResolvedPortfolioItem[] }) {
  return (
    <div className="mt-12 rounded-[2rem] border border-soft-border bg-white/80 p-5 shadow-[0_22px_60px_rgba(136,103,110,0.07)] sm:p-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <div
            key={item.href}
            className="relative overflow-hidden rounded-[1.7rem] border border-soft-border bg-warm-white"
          >
            <div className="aspect-[5/6]">
              <WorkCardMedia
                src={item.image}
                alt={item.alt}
                title={item.title}
                hasImage={item.hasImage}
                sizes="(min-width: 1280px) 24vw, (min-width: 768px) 48vw, 100vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorksSection() {
  const resolvedItems: ResolvedPortfolioItem[] = portfolioConfig.items.map((item) => ({
    ...item,
    hasImage: hasLocalImage(item.image),
  }));

  const featuredItem =
    resolvedItems.find((item) => item.featured) ?? resolvedItems[0];
  const otherItems = resolvedItems.filter((item) => item.href !== featuredItem?.href);
  const isManualMode = portfolioConfig.mode === "manual";

  return (
    <section
      id="trabajos"
      className="section-anchor relative overflow-hidden border-y border-soft-border/70 bg-white/48 py-20 sm:py-24"
    >
      <PetalCluster className="-right-8 top-10 hidden scale-[0.92] opacity-50 md:block" />
      <SakuraBranch className="-left-8 top-24 hidden opacity-45 lg:block" />

      <Container>
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Instagram"
            title="Trabajos"
            description="Una pequeña selección de piezas recientes. Puedes ver más en Instagram."
            className="max-w-2xl"
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
          <div className="mt-12 grid gap-4 min-[520px]:grid-cols-2 md:gap-5 xl:grid-cols-4">
            <WorkCard item={featuredItem} featured />
            {otherItems.map((item) => (
              <WorkCard key={item.href} item={item} />
            ))}
          </div>
        ) : (
          <ExternalPortfolioPanel items={resolvedItems} />
        )}

        <InstagramFeaturedEmbed />
      </Container>
    </section>
  );
}
