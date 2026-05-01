export type PortfolioFeedMode = "manual" | "external";

export type PortfolioItem = {
  title: string;
  caption: string;
  alt: string;
  imageSrc?: string;
  instagramEmbedUrl?: string;
  featured?: boolean;
};

export const INSTAGRAM_URL = "https://instagram.com/sakuraneedletattoo";
export const INSTAGRAM_LABEL = "@sakuraneedletattoo";

/*
  Cambia `mode` a "external" si prefieres mostrar solo el acceso al perfil
  de Instagram. Para usar imágenes reales en modo manual, añade archivos a
  /public/portfolio y completa `imageSrc` con rutas como "/portfolio/01.jpg".
*/
export const portfolioConfig: {
  mode: PortfolioFeedMode;
  instagramUrl: string;
  instagramLabel: string;
  items: PortfolioItem[];
} = {
  mode: "manual",
  instagramUrl: INSTAGRAM_URL,
  instagramLabel: INSTAGRAM_LABEL,
  items: [
    {
      title: "Pieza protagonista",
      caption: "Ideal para una imagen vertical con presencia, calma y detalle.",
      alt: "Fotografía principal de un tatuaje realizado por Sakura Needle Tattoo",
      featured: true,
      // imageSrc: "/portfolio/hero-piece.jpg",
    },
    {
      title: "Detalle cercano",
      caption: "Perfecto para primeros planos con luz suave y fondo limpio.",
      alt: "Detalle cercano de un tatuaje de Sakura Needle Tattoo",
      // imageSrc: "/portfolio/detail-close-up.jpg",
    },
    {
      title: "Composición delicada",
      caption: "Pensado para mostrar una pieza equilibrada y cuidada.",
      alt: "Composición delicada de tatuaje en el portfolio de Sakura Needle Tattoo",
      // imageSrc: "/portfolio/composition.jpg",
    },
    {
      title: "Mini tattoo",
      caption: "Un espacio listo para piezas pequeñas, sutiles y elegantes.",
      alt: "Mini tattoo realizado por Sakura Needle Tattoo",
      // imageSrc: "/portfolio/mini-tattoo.jpg",
    },
    {
      title: "Ambiente de estudio",
      caption: "Úsalo para retratos, manos, materiales o momentos de sesión.",
      alt: "Imagen del ambiente de estudio de Sakura Needle Tattoo",
      // imageSrc: "/portfolio/studio-moment.jpg",
    },
    {
      title: "Resultado final",
      caption: "Listo para placement, tatuaje cicatrizado o fotografía editorial.",
      alt: "Resultado final de un tatuaje realizado por Sakura Needle Tattoo",
      // imageSrc: "/portfolio/final-piece.jpg",
    },
  ],
};
