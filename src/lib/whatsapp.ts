export function cleanPhoneNumber(phone: string) {
  const trimmed = phone.trim();

  if (!trimmed) {
    return "";
  }

  const normalized = trimmed.replace(/[^\d+]/g, "");

  if (normalized.startsWith("+")) {
    return normalized.slice(1).replace(/\D/g, "");
  }

  const digitsOnly = normalized.replace(/\D/g, "");

  return digitsOnly.startsWith("00") ? digitsOnly.slice(2) : digitsOnly;
}

export function buildDirectWhatsappUrl(phone: string, message?: string) {
  const cleanedPhone = cleanPhoneNumber(phone);

  if (!cleanedPhone) {
    return null;
  }

  const baseUrl = `https://wa.me/${cleanedPhone}`;

  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

export function buildClientWhatsappUrl(phone: string, firstName?: string) {
  const greeting = firstName?.trim() ? `Hola ${firstName.trim()},` : "Hola,";
  const message = `${greeting} soy Sara de Sakura Needle Tattoo 🌸\nHe recibido tu solicitud de cita. Te escribo para concretar diseño, tamaño y horario.`;

  return buildDirectWhatsappUrl(phone, message);
}
