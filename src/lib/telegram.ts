import { BRAND_NAME } from "@/config/site";
import {
  formatSelectedSlots,
  mapDesignStatusLabel,
  type AppointmentRequestPayload,
} from "@/lib/appointments";
import { cleanPhoneNumber } from "@/lib/whatsapp";

export function buildTelegramMessage(payload: AppointmentRequestPayload) {
  const fullName = [payload.firstName, payload.lastName?.trim()]
    .filter(Boolean)
    .join(" ");
  const availabilityLines = formatSelectedSlots(payload.selectedSlots)
    .map((item) => `- ${item}`)
    .join("\n");
  const comment = payload.comment?.trim() || "Sin comentario";
  const cleanedPhone = cleanPhoneNumber(payload.phone);
  const whatsappLink = cleanedPhone
    ? `https://wa.me/${cleanedPhone}`
    : payload.phone.trim();

  return [
    `🌸 Nueva solicitud de cita - ${BRAND_NAME}`,
    "",
    `👤 Nombre: ${fullName}`,
    `📞 Teléfono: ${payload.phone.trim()}`,
    "",
    "📅 Disponibilidad:",
    availabilityLines,
    "",
    `🎨 ¿Tiene diseño pensado?: ${mapDesignStatusLabel(payload.designStatus)}`,
    "",
    "💬 Comentario:",
    comment,
    "",
    "Estado: Pendiente",
    "",
    "Abrir WhatsApp:",
    whatsappLink,
  ].join("\n");
}

export async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram environment variables are missing.");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Telegram request failed with status ${response.status}: ${errorBody}`,
    );
  }

  return response.json();
}
