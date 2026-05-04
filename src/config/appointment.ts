export type BookingMode = "custom" | "external" | "embed";

export const appointmentConfig = {
  bookingMode: "custom" as BookingMode,
  maxMonthsAhead: 3,
  whatsappNumber: "34612345678",
  whatsappLabel: "+34 612 345 678",
  externalBookingUrl:
    "https://calendly.com/sakura-needle-tattoo/consulta",
  embedUrl: "https://calendly.com/sakura-needle-tattoo/consulta",
  ctaLabel: "Reservar cita",
  submitLabel: "Enviar solicitud",
  successMessage:
    "Solicitud enviada. Sara recibirá el aviso y te contactará para concretar la cita.",
  helperText:
    "Elige una de las fechas disponibles y cuéntame un poco tu idea. Después te escribiré para concretar diseño, tamaño y hora exacta.",
  privacyNote:
    "Usaremos estos datos únicamente para gestionar tu solicitud de cita y contactar contigo.",
} as const;
