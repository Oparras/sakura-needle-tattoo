import { NextResponse } from "next/server";
import {
  isAppointmentPeriod,
  normalizeSelectedSlots,
  type AppointmentRequestStatus,
  type AvailabilitySlot,
} from "@/lib/appointments";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  answerTelegramCallbackQuery,
  parseTelegramCallbackData,
  type TelegramCallbackAction,
} from "@/lib/telegram";

type TelegramChat = {
  id: number | string;
};

type TelegramMessage = {
  chat?: TelegramChat;
};

type TelegramCallbackQuery = {
  id?: string;
  data?: string;
  message?: TelegramMessage;
};

type TelegramUpdate = {
  callback_query?: TelegramCallbackQuery;
};

type AppointmentRequestLookup = {
  id: string;
  status: AppointmentRequestStatus;
  selected_slots: unknown;
};

function getTelegramChatId() {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId) {
    throw new Error("TELEGRAM_CHAT_ID is missing.");
  }

  return chatId.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getWebhookSecretIsValid(request: Request) {
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();

  if (!configuredSecret) {
    return true;
  }

  const providedSecret =
    request.headers.get("x-telegram-bot-api-secret-token")?.trim() ?? "";

  return providedSecret === configuredSecret;
}

function getCallbackQuery(update: unknown): TelegramCallbackQuery | null {
  if (!isRecord(update) || !isRecord(update.callback_query)) {
    return null;
  }

  return update.callback_query as TelegramCallbackQuery;
}

function getSlotColumn(period: "morning" | "afternoon") {
  return period === "morning" ? "morning_available" : "afternoon_available";
}

function getAvailabilityPatch(
  period: "morning" | "afternoon",
  value: boolean,
) {
  return period === "morning"
    ? { morning_available: value }
    : { afternoon_available: value };
}

async function getAppointmentRequest(
  requestId: string,
): Promise<AppointmentRequestLookup | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("appointment_requests")
    .select("id, status, selected_slots")
    .eq("id", requestId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    status: data.status as AppointmentRequestStatus,
    selected_slots: data.selected_slots,
  };
}

async function updateRequestStatus(
  requestId: string,
  status: AppointmentRequestStatus,
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("appointment_requests")
    .update({ status })
    .eq("id", requestId);

  if (error) {
    throw error;
  }
}

async function getAvailabilitySlot(date: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("availability_slots")
    .select(
      "id, date, morning_available, afternoon_available, note, created_at, updated_at",
    )
    .eq("date", date)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as AvailabilitySlot | null) ?? null;
}

async function reserveRequestedSlot(
  action: Extract<TelegramCallbackAction, { kind: "slot" }>,
) {
  const request = await getAppointmentRequest(action.requestId);

  if (!request) {
    return "No se encontró la solicitud asociada a este botón.";
  }

  const selectedSlots = normalizeSelectedSlots(request.selected_slots);
  const includesRequestedSlot = selectedSlots.some(
    (slot) => slot.date === action.date && slot.period === action.period,
  );

  if (!includesRequestedSlot) {
    return "La franja indicada no pertenece a esta solicitud.";
  }

  const currentAvailability = await getAvailabilitySlot(action.date);
  const periodColumn = getSlotColumn(action.period);

  if (!currentAvailability || !currentAvailability[periodColumn]) {
    return "Esta franja ya está reservada o no disponible.";
  }

  const supabase = getSupabaseAdminClient();
  const { data: updatedSlot, error: slotError } = await supabase
    .from("availability_slots")
    .update(getAvailabilityPatch(action.period, false))
    .eq("date", action.date)
    .eq(periodColumn, true)
    .select("id")
    .maybeSingle();

  if (slotError) {
    throw slotError;
  }

  if (!updatedSlot) {
    return "Esta franja ya está reservada o no disponible.";
  }

  try {
    await updateRequestStatus(action.requestId, "confirmed");
  } catch (error) {
    await supabase
      .from("availability_slots")
      .update(getAvailabilityPatch(action.period, true))
      .eq("date", action.date);

    throw error;
  }

  return "✅ Franja reservada y retirada del calendario.";
}

async function reopenRequestedSlot(
  action: Extract<TelegramCallbackAction, { kind: "slot" }>,
) {
  const request = await getAppointmentRequest(action.requestId);

  if (!request) {
    return "No se encontró la solicitud asociada a este botón.";
  }

  const selectedSlots = normalizeSelectedSlots(request.selected_slots);
  const includesRequestedSlot = selectedSlots.some(
    (slot) => slot.date === action.date && slot.period === action.period,
  );

  if (!includesRequestedSlot) {
    return "La franja indicada no pertenece a esta solicitud.";
  }

  const currentAvailability = await getAvailabilitySlot(action.date);
  const periodColumn = getSlotColumn(action.period);
  const otherColumn =
    periodColumn === "morning_available"
      ? "afternoon_available"
      : "morning_available";

  const nextAvailability = {
    date: action.date,
    morning_available:
      periodColumn === "morning_available"
        ? true
        : Boolean(currentAvailability?.morning_available),
    afternoon_available:
      periodColumn === "afternoon_available"
        ? true
        : Boolean(currentAvailability?.afternoon_available),
    note: currentAvailability?.note ?? null,
  };

  const supabase = getSupabaseAdminClient();
  const { error: slotError } = await supabase
    .from("availability_slots")
    .upsert(nextAvailability, {
      onConflict: "date",
    });

  if (slotError) {
    throw slotError;
  }

  try {
    await updateRequestStatus(action.requestId, "cancelled");
  } catch (error) {
    if (currentAvailability) {
      await supabase
        .from("availability_slots")
        .update({
          morning_available: currentAvailability.morning_available,
          afternoon_available: currentAvailability.afternoon_available,
          note: currentAvailability.note,
        })
        .eq("date", action.date);
    } else if (!nextAvailability[otherColumn]) {
      await supabase.from("availability_slots").delete().eq("date", action.date);
    } else {
      await supabase
        .from("availability_slots")
        .update(getAvailabilityPatch(action.period, false))
        .eq("date", action.date);
    }

    throw error;
  }

  return "🔓 Franja reabierta y visible en el calendario.";
}

async function handleCallbackAction(action: TelegramCallbackAction) {
  if (action.kind === "request-status") {
    const request = await getAppointmentRequest(action.requestId);

    if (!request) {
      return "No se encontró la solicitud asociada a este botón.";
    }

    if (action.action === "ct") {
      if (request.status !== "contacted") {
        await updateRequestStatus(action.requestId, "contacted");
      }

      return "👤 Solicitud marcada como contactada.";
    }

    if (request.status !== "cancelled") {
      await updateRequestStatus(action.requestId, "cancelled");
    }

    return "❌ Solicitud cancelada.";
  }

  if (!isAppointmentPeriod(action.period)) {
    return "La franja indicada no es válida.";
  }

  if (action.action === "rs") {
    return reserveRequestedSlot(action);
  }

  return reopenRequestedSlot(action);
}

async function safelyAnswerCallbackQuery(callbackQueryId: string, text: string) {
  try {
    await answerTelegramCallbackQuery(callbackQueryId, text);
  } catch (error) {
    console.error("Failed to answer Telegram callback query", error);
  }
}

export async function POST(request: Request) {
  try {
    if (!getWebhookSecretIsValid(request)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized webhook request.",
        },
        { status: 401 },
      );
    }

    let update: TelegramUpdate;

    try {
      update = (await request.json()) as TelegramUpdate;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid Telegram payload.",
        },
        { status: 400 },
      );
    }

    const callbackQuery = getCallbackQuery(update);

    if (!callbackQuery?.id || !callbackQuery.data) {
      return NextResponse.json({ ok: true });
    }

    const callbackChatId = callbackQuery.message?.chat?.id;

    if (String(callbackChatId ?? "") !== getTelegramChatId()) {
      await safelyAnswerCallbackQuery(
        callbackQuery.id,
        "Este chat no esta autorizado para gestionar solicitudes.",
      );

      return NextResponse.json({ ok: true });
    }

    const action = parseTelegramCallbackData(callbackQuery.data);

    if (!action) {
      await safelyAnswerCallbackQuery(
        callbackQuery.id,
        "Accion no valida o manipulada.",
      );

      return NextResponse.json({ ok: true });
    }

    try {
      const resultMessage = await handleCallbackAction(action);
      await safelyAnswerCallbackQuery(callbackQuery.id, resultMessage);
    } catch (error) {
      console.error("Failed to process Telegram callback", {
        action,
        error,
      });
      await safelyAnswerCallbackQuery(
        callbackQuery.id,
        "No se pudo procesar esta accion. Intentalo de nuevo.",
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected Telegram webhook error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected Telegram webhook error.",
      },
      { status: 500 },
    );
  }
}
