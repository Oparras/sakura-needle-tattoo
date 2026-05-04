import { NextResponse } from "next/server";
import { appointmentConfig } from "@/config/appointment";
import {
  hasAvailablePeriods,
  isDesignStatus,
  mapPeriodLabel,
  normalizeSelectedSlots,
  sanitizeAppointmentPayload,
  type AppointmentRequestPayload,
  type AvailabilitySlot,
} from "@/lib/appointments";
import {
  addMonths,
  getMonthEnd,
  getMonthStart,
  getToday,
  isPastIsoDate,
  toIsoDate,
} from "@/lib/date";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildTelegramMessage, sendTelegramNotification } from "@/lib/telegram";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function buildPayload(body: Record<string, unknown>): AppointmentRequestPayload {
  return {
    firstName: typeof body.firstName === "string" ? body.firstName : "",
    lastName: typeof body.lastName === "string" ? body.lastName : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    designStatus: String(
      typeof body.designStatus === "string" ? body.designStatus : "",
    ) as AppointmentRequestPayload["designStatus"],
    comment: typeof body.comment === "string" ? body.comment : "",
    selectedSlots: normalizeSelectedSlots(body.selectedSlots),
  };
}

function validatePayload(payload: AppointmentRequestPayload) {
  const errors: Record<string, string> = {};

  if (!payload.firstName.trim()) {
    errors.firstName = "Indica tu nombre.";
  }

  if (!payload.phone.trim()) {
    errors.phone = "Indica un telefono de contacto.";
  }

  if (!isDesignStatus(payload.designStatus)) {
    errors.designStatus = "Selecciona si tienes el diseno pensado.";
  }

  if (payload.selectedSlots.length === 0) {
    errors.selectedSlots = "Selecciona al menos una franja disponible.";
  }

  return errors;
}

function isSlotInsideAllowedRange(date: string) {
  const monthStart = getMonthStart(getToday());
  const maxDate = toIsoDate(
    getMonthEnd(addMonths(monthStart, appointmentConfig.maxMonthsAhead)),
  );

  return !isPastIsoDate(date) && date <= maxDate;
}

function buildAvailabilityMap(slots: AvailabilitySlot[]) {
  return new Map(slots.map((slot) => [slot.date, slot]));
}

export async function POST(request: Request) {
  console.log("Appointment env check", {
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasTelegramToken: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    hasTelegramChatId: Boolean(process.env.TELEGRAM_CHAT_ID),
    hasWebhookSecret: Boolean(process.env.TELEGRAM_WEBHOOK_SECRET),
  });

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo leer la solicitud.",
      },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Formato de solicitud no valido.",
      },
      { status: 400 },
    );
  }

  try {
    const payload = sanitizeAppointmentPayload(buildPayload(body));
    const fieldErrors = validatePayload(payload);

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Revisa los campos del formulario.",
          fieldErrors,
        },
        { status: 400 },
      );
    }

    if (
      payload.selectedSlots.some((slot) => !isSlotInsideAllowedRange(slot.date))
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Alguna de las fechas seleccionadas ya no esta disponible o queda fuera del rango permitido.",
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const requestedDates = [
      ...new Set(payload.selectedSlots.map((slot) => slot.date)),
    ];
    const { data: availabilityData, error: availabilityError } = await supabase
      .from("availability_slots")
      .select(
        "id, date, morning_available, afternoon_available, note, created_at, updated_at",
      )
      .in("date", requestedDates);

    if (availabilityError) {
      console.error("Failed to load availability slots", availabilityError);

      return NextResponse.json(
        {
          ok: false,
          error:
            "No se pudo validar la disponibilidad seleccionada. Intentalo de nuevo en unos minutos.",
        },
        { status: 500 },
      );
    }

    const availabilityMap = buildAvailabilityMap(
      (availabilityData ?? []) as AvailabilitySlot[],
    );
    const invalidSelection = payload.selectedSlots.find((slot) => {
      const availability = availabilityMap.get(slot.date);

      if (!availability || !hasAvailablePeriods(availability)) {
        return true;
      }

      if (slot.period === "morning") {
        return !availability.morning_available;
      }

      return !availability.afternoon_available;
    });

    if (invalidSelection) {
      return NextResponse.json(
        {
          ok: false,
          error: `La franja ${mapPeriodLabel(invalidSelection.period).toLowerCase()} del ${invalidSelection.date} ya no esta disponible.`,
        },
        { status: 400 },
      );
    }

    const { data: insertedRequest, error: insertError } = await supabase
      .from("appointment_requests")
      .insert({
        first_name: payload.firstName,
        last_name: payload.lastName || null,
        phone: payload.phone,
        design_status: payload.designStatus,
        comment: payload.comment || null,
        selected_slots: payload.selectedSlots,
      })
      .select("id")
      .single();

    if (insertError || !insertedRequest) {
      console.error("Failed to insert appointment request", insertError);

      return NextResponse.json(
        {
          ok: false,
          error: "No se pudo guardar la solicitud.",
        },
        { status: 500 },
      );
    }

    let telegramSent = false;
    let warning: string | undefined;

    try {
      await sendTelegramNotification(
        buildTelegramMessage(payload, insertedRequest.id),
      );
      telegramSent = true;
    } catch (error) {
      warning =
        "Solicitud guardada, pero no se pudo enviar la notificacion de Telegram.";
      console.error("Telegram notification failed", error);
    }

    return NextResponse.json(
      {
        ok: true,
        telegramSent,
        warning,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unexpected appointment request error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Error inesperado al enviar la solicitud.",
      },
      { status: 500 },
    );
  }
}
