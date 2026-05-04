import { formatAppointmentDate } from "@/lib/date";

export const APPOINTMENT_PERIODS = ["morning", "afternoon"] as const;
export const DESIGN_STATUSES = ["yes", "no", "unsure"] as const;
export const REQUEST_STATUSES = [
  "pending",
  "contacted",
  "confirmed",
  "cancelled",
] as const;

export type AppointmentPeriod = (typeof APPOINTMENT_PERIODS)[number];
export type DesignStatus = (typeof DESIGN_STATUSES)[number];
export type AppointmentRequestStatus = (typeof REQUEST_STATUSES)[number];

export type SelectedSlot = {
  date: string;
  period: AppointmentPeriod;
};

export type AvailabilitySlot = {
  id: string;
  date: string;
  morning_available: boolean;
  afternoon_available: boolean;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type AppointmentRequestPayload = {
  firstName: string;
  lastName?: string;
  phone: string;
  designStatus: DesignStatus;
  comment?: string;
  selectedSlots: SelectedSlot[];
};

export type AppointmentRequestRecord = {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  design_status: DesignStatus;
  comment: string | null;
  selected_slots: SelectedSlot[];
  status: AppointmentRequestStatus;
  created_at: string;
};

export type AppointmentRequestFieldErrors = Partial<
  Record<"firstName" | "phone" | "designStatus" | "selectedSlots", string>
>;

export function isAppointmentPeriod(value: string): value is AppointmentPeriod {
  return APPOINTMENT_PERIODS.includes(value as AppointmentPeriod);
}

export function isDesignStatus(value: string): value is DesignStatus {
  return DESIGN_STATUSES.includes(value as DesignStatus);
}

export function isRequestStatus(value: string): value is AppointmentRequestStatus {
  return REQUEST_STATUSES.includes(value as AppointmentRequestStatus);
}

export function getSelectedSlotKey(slot: SelectedSlot) {
  return `${slot.date}:${slot.period}`;
}

export function hasAvailablePeriods(
  slot?: Pick<AvailabilitySlot, "morning_available" | "afternoon_available"> | null,
) {
  return Boolean(slot?.morning_available || slot?.afternoon_available);
}

export function mapPeriodLabel(period: AppointmentPeriod) {
  switch (period) {
    case "morning":
      return "Manana";
    case "afternoon":
      return "Tarde";
    default:
      return period;
  }
}

export function mapDesignStatusLabel(status: DesignStatus) {
  switch (status) {
    case "yes":
      return "Si";
    case "no":
      return "No";
    case "unsure":
      return "Mas o menos";
    default:
      return status;
  }
}

export function mapRequestStatusLabel(status: AppointmentRequestStatus) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "contacted":
      return "Contactada";
    case "confirmed":
      return "Confirmada";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
}

export function normalizeSelectedSlots(input: unknown) {
  if (!Array.isArray(input)) {
    return [] as SelectedSlot[];
  }

  const seen = new Set<string>();
  const normalized: SelectedSlot[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const date = typeof item.date === "string" ? item.date.trim() : "";
    const period = typeof item.period === "string" ? item.period.trim() : "";

    if (!date || !isAppointmentPeriod(period)) {
      continue;
    }

    const slot = { date, period };
    const key = getSelectedSlotKey(slot);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(slot);
  }

  return normalized.sort((left, right) => {
    const byDate = left.date.localeCompare(right.date);

    if (byDate !== 0) {
      return byDate;
    }

    return left.period.localeCompare(right.period);
  });
}

export function sanitizeAppointmentPayload(
  payload: AppointmentRequestPayload,
): AppointmentRequestPayload {
  return {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName?.trim() || "",
    phone: payload.phone.trim(),
    designStatus: payload.designStatus,
    comment: payload.comment?.trim() || "",
    selectedSlots: normalizeSelectedSlots(payload.selectedSlots),
  };
}

export function validateAppointmentRequestPayload(
  payload: AppointmentRequestPayload,
) {
  const errors: AppointmentRequestFieldErrors = {};

  if (!payload.firstName.trim()) {
    errors.firstName = "Indica tu nombre.";
  }

  if (!payload.phone.trim()) {
    errors.phone = "Indica un telefono de contacto.";
  }

  if (!isDesignStatus(payload.designStatus)) {
    errors.designStatus = "Selecciona si tienes el diseno pensado.";
  }

  if (normalizeSelectedSlots(payload.selectedSlots).length === 0) {
    errors.selectedSlots = "Selecciona al menos una franja disponible.";
  }

  return errors;
}

export function formatSelectedSlots(slots: SelectedSlot[]) {
  return normalizeSelectedSlots(slots).map(
    (slot) => `${formatAppointmentDate(slot.date)} · ${mapPeriodLabel(slot.period)}`,
  );
}
