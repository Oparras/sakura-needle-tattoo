export const BRAND_NAME = "Sakura Needle Tattoo";
export type BookingMode = "external" | "embed";
export const BOOKING_URL =
  "https://calendly.com/sakura-needle-tattoo/consulta";
export const BOOKING_MODE: BookingMode = "external";

export const siteConfig = {
  brandName: BRAND_NAME,
  shortName: "Sakura Needle",
  siteUrl: "https://your-domain.com",
  logoSrc: "/sakura-needle-logo.jpeg",
  logoAlt:
    "Logo de Sakura Needle Tattoo con una máquina de tatuar fine line y flores Sakura",
  description:
    "Estudio boutique de fine line y floral tattoo con diseños delicados, personalizados y una experiencia serena de cita previa.",
  instagramUrl: "https://instagram.com/sakuraneedletattoo",
  instagramLabel: "@sakuraneedletattoo",
  whatsappUrl: "https://wa.me/34612345678",
  whatsappLabel: "+34 612 345 678",
  email: "hola@sakuraneedletattoo.com",
  city: "Madrid · Estudio privado con cita previa",
  booking: {
    mode: BOOKING_MODE,
    url: BOOKING_URL,
    embedUrl: BOOKING_URL,
    ctaLabel: "Reservar cita",
    iframeTitle: `Reserva tu cita con ${BRAND_NAME}`,
  },
};

export const navigationItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Servicios", href: "#servicios" },
  { label: "Trabajos", href: "#trabajos" },
  { label: "Reservar", href: "#reservar" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacto", href: "#contacto" },
] as const;
