export type PortfolioFeedMode = "manual" | "external";
export type PortfolioItemType = "post" | "reel";

export type PortfolioItem = {
  title: string;
  href: string;
  image: string;
  alt: string;
  type: PortfolioItemType;
  featured?: boolean;
};

export type FeaturedInstagramEmbedConfig = {
  enabled: boolean;
  href: string;
  type: PortfolioItemType;
  title: string;
};

export const INSTAGRAM_URL = "https://instagram.com/sakuraneedletattoo";
export const INSTAGRAM_LABEL = "@sakuraneedletattoo";

/*
  Añade imágenes reales en /public/works/ manteniendo estos nombres:
  - /works/work-01.jpg
  - /works/work-02.jpg
  - ...
  - /works/work-08.jpg

  Si una imagen todavía no existe, la galería mostrará automáticamente un
  placeholder con estética Sakura sin romper el layout.

  Cambia `mode` a "external" si prefieres mostrar una selección más ligera
  y derivar el tráfico directamente al perfil de Instagram.
*/
export const portfolioConfig: {
  mode: PortfolioFeedMode;
  instagramUrl: string;
  instagramLabel: string;
  items: PortfolioItem[];
  featuredEmbed: FeaturedInstagramEmbedConfig;
} = {
  mode: "manual",
  instagramUrl: INSTAGRAM_URL,
  instagramLabel: INSTAGRAM_LABEL,
  items: [
    {
      title: "Pieza 01",
      href: "https://www.instagram.com/p/DVojWmaDBUm/",
      image: "/works/work-01.jpg",
      alt: "Pieza reciente de Sakura Needle Tattoo publicada en Instagram",
      type: "post",
      featured: true,
    },
    {
      title: "Pieza 02",
      href: "https://www.instagram.com/p/DXWbRw6DJDs/",
      image: "/works/work-02.jpg",
      alt: "Detalle de tatuaje reciente de Sakura Needle Tattoo",
      type: "post",
    },
    {
      title: "Pieza 03",
      href: "https://www.instagram.com/p/DXHEBmaDBIA/?img_index=1",
      image: "/works/work-03.jpg",
      alt: "Selección reciente de tatuaje de Sakura Needle Tattoo",
      type: "post",
    },
    {
      title: "Pieza 04",
      href: "https://www.instagram.com/p/DXCPuGDDFF2/",
      image: "/works/work-04.jpg",
      alt: "Trabajo reciente de Sakura Needle Tattoo enlazado a Instagram",
      type: "post",
    },
    {
      title: "Pieza 05",
      href: "https://www.instagram.com/p/DWjExpBjNmv/?img_index=1",
      image: "/works/work-05.jpg",
      alt: "Tatuaje delicado de Sakura Needle Tattoo publicado en Instagram",
      type: "post",
    },
    {
      title: "Pieza 06",
      href: "https://www.instagram.com/p/DWTiZ3hDF0D/?img_index=1",
      image: "/works/work-06.jpg",
      alt: "Fotografía de tatuaje reciente de Sakura Needle Tattoo",
      type: "post",
    },
    {
      title: "Pieza 07",
      href: "https://www.instagram.com/p/DWOVrbEDGTs/?img_index=1",
      image: "/works/work-07.jpg",
      alt: "Publicación de tatuaje de Sakura Needle Tattoo en Instagram",
      type: "post",
    },
    {
      title: "Pieza 08",
      href: "https://www.instagram.com/p/DV4H5iwjHRs/",
      image: "/works/work-08.jpg",
      alt: "Reel reciente de Sakura Needle Tattoo en Instagram",
      type: "reel",
    },
  ],
  featuredEmbed: {
    enabled: false,
    href: "https://www.instagram.com/p/DV4H5iwjHRs/",
    type: "reel",
    title: "Reel destacado",
  },
};
