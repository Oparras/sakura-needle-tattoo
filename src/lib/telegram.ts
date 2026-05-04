import "server-only";

import { BRAND_NAME } from "@/config/site";
import {
  formatSelectedSlots,
  isAppointmentPeriod,
  mapDesignStatusLabel,
  type AppointmentRequestPayload,
  type AppointmentPeriod,
  type SelectedSlot,
} from "@/lib/appointments";
import { formatDayMonthDate, isValidIsoDate } from "@/lib/date";
import { cleanPhoneNumber } from "@/lib/whatsapp";

const REQUEST_STATUS_ACTIONS = ["ct", "cn"] as const;
const SLOT_ACTIONS = ["rs", "ro"] as const;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RequestStatusAction = (typeof REQUEST_STATUS_ACTIONS)[number];
type SlotAction = (typeof SLOT_ACTIONS)[number];

type TelegramInlineKeyboardButton = {
  text: string;
  callback_data: string;
};

type TelegramReplyMarkup = {
  inline_keyboard: TelegramInlineKeyboardButton[][];
};

export type TelegramMessagePayload = {
  text: string;
  replyMarkup?: TelegramReplyMarkup;
};

export type TelegramCallbackAction =
  | {
      kind: "request-status";
      action: RequestStatusAction;
      requestId: string;
    }
  | {
      kind: "slot";
      action: SlotAction;
      requestId: string;
      date: string;
      period: AppointmentPeriod;
    };

function getTelegramEnvironment() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram environment variables are missing.");
  }

  return { token, chatId };
}

function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

function buildSlotActionLabel(
  action: "reserve" | "reopen",
  slot: SelectedSlot,
) {
  const periodLabel = slot.period === "morning" ? "mañana" : "tarde";

  return `${action === "reserve" ? "Reservar" : "Reabrir"} ${formatDayMonthDate(
    slot.date,
  )} ${periodLabel}`;
}

function buildTelegramKeyboard(
  requestId: string,
  selectedSlots: SelectedSlot[],
): TelegramReplyMarkup {
  const slotRows = selectedSlots.map((slot) => [
    {
      text: buildSlotActionLabel("reserve", slot),
      callback_data: `sl:rs:${requestId}:${slot.date}:${slot.period}`,
    },
    {
      text: buildSlotActionLabel("reopen", slot),
      callback_data: `sl:ro:${requestId}:${slot.date}:${slot.period}`,
    },
  ]);

  return {
    inline_keyboard: [
      ...slotRows,
      [
        {
          text: "Marcar contactado",
          callback_data: `rq:ct:${requestId}`,
        },
        {
          text: "Cancelar solicitud",
          callback_data: `rq:cn:${requestId}`,
        },
      ],
    ],
  };
}

export function buildTelegramMessage(
  payload: AppointmentRequestPayload,
  requestId: string,
): TelegramMessagePayload {
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

  return {
    text: [
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
    ].join("\n"),
    replyMarkup: buildTelegramKeyboard(requestId, payload.selectedSlots),
  };
}

export function parseTelegramCallbackData(
  callbackData: string,
): TelegramCallbackAction | null {
  const requestMatch = callbackData.match(/^rq:(ct|cn):([0-9a-f-]{36})$/i);

  if (requestMatch) {
    const [, action, requestId] = requestMatch;

    if (
      REQUEST_STATUS_ACTIONS.includes(action as RequestStatusAction) &&
      isUuid(requestId)
    ) {
      return {
        kind: "request-status",
        action: action as RequestStatusAction,
        requestId,
      };
    }

    return null;
  }

  const slotMatch = callbackData.match(
    /^sl:(rs|ro):([0-9a-f-]{36}):(\d{4}-\d{2}-\d{2}):(morning|afternoon)$/i,
  );

  if (!slotMatch) {
    return null;
  }

  const [, action, requestId, date, period] = slotMatch;

  if (
    !SLOT_ACTIONS.includes(action as SlotAction) ||
    !isUuid(requestId) ||
    !isValidIsoDate(date) ||
    !isAppointmentPeriod(period)
  ) {
    return null;
  }

  return {
    kind: "slot",
    action: action as SlotAction,
    requestId,
    date,
    period,
  };
}

async function callTelegramApi(method: string, payload: Record<string, unknown>) {
  const { token } = getTelegramEnvironment();
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Telegram request failed with status ${response.status}: ${errorBody}`,
    );
  }

  return response.json();
}

export async function sendTelegramNotification(message: TelegramMessagePayload) {
  const { chatId } = getTelegramEnvironment();

  return callTelegramApi("sendMessage", {
    chat_id: chatId,
    text: message.text,
    reply_markup: message.replyMarkup,
  });
}

export async function answerTelegramCallbackQuery(
  callbackQueryId: string,
  text: string,
) {
  return callTelegramApi("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false,
  });
}
