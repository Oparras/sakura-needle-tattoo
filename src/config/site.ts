import { appointmentConfig, type BookingMode } from "@/config/appointment";
import { INSTAGRAM_LABEL, INSTAGRAM_URL } from "@/config/portfolio";
import { buildDirectWhatsappUrl } from "@/lib/whatsapp";

export const BRAND_NAME = "Sakura Needle Tattoo";

const BOOKING_URL =
  appointmentConfig.bookingMode === "custom"
    ? "#reservar"
    : appointmentConfig.externalBookingUrl;
const WHATSAPP_URL =
  buildDirectWhatsappUrl(appointmentConfig.whatsappNumber) ?? "";

export const siteConfig = {
  brandName: BRAND_NAME,
  shortName: "Sakura Needle",
  siteUrl: "https://your-domain.com",
  logoSrc: "/sakura-needle-logo.jpeg",
  logoAlt:
    "Logo de Sakura Needle Tattoo con flores Sakura y una maquina de tatuar delicada",
  description:
    "Tatuajes personalizados con una propuesta delicada, limpia y serena y solicitud de cita previa.",
  instagramUrl: INSTAGRAM_URL,
  instagramLabel: INSTAGRAM_LABEL,
  whatsappUrl: WHATSAPP_URL,
  whatsappLabel: appointmentConfig.whatsappLabel,
  email: "hola@sakuraneedletattoo.com",
  city: "Madrid · Estudio privado con cita previa",
  booking: {
    mode: appointmentConfig.bookingMode as BookingMode,
    url: BOOKING_URL,
    externalUrl: appointmentConfig.externalBookingUrl,
    embedUrl: appointmentConfig.embedUrl,
    ctaLabel: appointmentConfig.ctaLabel,
    opensInNewTab: appointmentConfig.bookingMode !== "custom",
    iframeTitle: `Reserva tu cita con ${BRAND_NAME}`,
  },
};

export const navigationItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Trabajos", href: "#trabajos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Reservar", href: "#reservar" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacto", href: "#contacto" },
] as const;

export type { BookingMode } from "@/config/appointment";
