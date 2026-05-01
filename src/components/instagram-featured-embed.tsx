import Script from "next/script";
import { portfolioConfig } from "@/config/portfolio";

function getInstagramEmbedUrl(url: string) {
  return url.includes("?")
    ? `${url}&utm_source=ig_embed&utm_campaign=loading`
    : `${url}?utm_source=ig_embed&utm_campaign=loading`;
}

export function InstagramFeaturedEmbed() {
  const { featuredEmbed } = portfolioConfig;

  if (!featuredEmbed.enabled || !featuredEmbed.href) {
    return null;
  }

  return (
    <div className="mt-10 rounded-[2rem] border border-soft-border bg-white/82 p-5 shadow-[0_20px_48px_rgba(136,103,110,0.06)] sm:p-6">
      <div className="rounded-[1.6rem] border border-soft-border bg-warm-white p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
          Destacado
        </p>
        <h3 className="mt-3 font-display text-3xl leading-[0.95] tracking-[-0.04em] text-foreground">
          {featuredEmbed.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted">
          Este bloque permite activar un único embed oficial sin cargar scripts
          de Instagram en toda la galería.
        </p>

        <blockquote
          className="instagram-media mt-5 min-w-[280px] rounded-[1.5rem] border border-soft-border bg-white"
          data-instgrm-captioned
          data-instgrm-permalink={getInstagramEmbedUrl(featuredEmbed.href)}
          data-instgrm-version="14"
        >
          <a
            href={featuredEmbed.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${featuredEmbed.type} destacado en Instagram`}
            className="block px-5 py-4 text-sm text-foreground"
          >
            Abrir {featuredEmbed.type} destacado en Instagram
          </a>
        </blockquote>

        <Script
          src="https://www.instagram.com/embed.js"
          strategy="lazyOnload"
        />

        {
          /*
            Si más adelante quieres pegar aquí el embed oficial completo de
            Instagram, sustituye el blockquote anterior manteniendo el Script
            condicional mientras featuredEmbed.enabled siga siendo true.
          */
        }
      </div>
    </div>
  );
}
