"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { AppointmentCalendar } from "@/components/appointment/appointment-calendar";
import { AppointmentTimeSlots } from "@/components/appointment/appointment-time-slots";
import { appointmentConfig } from "@/config/appointment";
import { siteConfig } from "@/config/site";
import {
  hasAvailablePeriods,
  isDesignStatus,
  normalizeSelectedSlots,
  sanitizeAppointmentPayload,
  validateAppointmentRequestPayload,
  type AppointmentRequestFieldErrors,
  type AvailabilitySlot,
  type DesignStatus,
  type SelectedSlot,
} from "@/lib/appointments";
import {
  addMonths,
  getMonthEnd,
  getMonthStart,
  getMonthDays,
  getToday,
  isSameMonth,
  parseIsoDate,
  toIsoDate,
} from "@/lib/date";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  designStatus: DesignStatus | "";
  comment: string;
};

type SubmitFeedback = {
  type: "success" | "error";
  message: string;
  warning?: string;
} | null;

type AppointmentRequestApiResponse = {
  ok: boolean;
  telegramSent?: boolean;
  error?: string;
  warning?: string;
  fieldErrors?: AppointmentRequestFieldErrors;
} | null;

const INITIAL_FORM_STATE: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  designStatus: "",
  comment: "",
};

const baseFieldClassName =
  "mt-2 w-full rounded-[1.2rem] border border-soft-border bg-warm-white px-4 py-3 text-sm text-foreground shadow-[0_10px_24px_rgba(136,103,110,0.04)] placeholder:text-muted/70";

function getFirstAvailableDateForMonth(
  month: Date,
  availabilitySlots: AvailabilitySlot[],
) {
  const availableDates = new Set(
    availabilitySlots
      .filter((slot) => hasAvailablePeriods(slot))
      .map((slot) => slot.date),
  );

  return (
    getMonthDays(month).find(
      (day) => day.isCurrentMonth && !day.isPast && availableDates.has(day.iso),
    )?.iso ?? null
  );
}

async function parseApiResponse(
  response: Response,
): Promise<AppointmentRequestApiResponse> {
  try {
    const text = await response.text();

    return text ? (JSON.parse(text) as AppointmentRequestApiResponse) : null;
  } catch {
    return null;
  }
}

export function AppointmentRequestWidget() {
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<AppointmentRequestFieldErrors>(
    {},
  );
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleMonth = addMonths(getMonthStart(getToday()), monthOffset);
  const availabilityByDate = new Map(
    availabilitySlots.map((slot) => [slot.date, slot]),
  );
  const activeAvailability = selectedDate
    ? availabilityByDate.get(selectedDate)
    : null;
  const canGoPrevious = monthOffset > 0;
  const canGoNext = monthOffset < appointmentConfig.maxMonthsAhead;

  useEffect(() => {
    let isActive = true;

    async function loadAvailability() {
      setAvailabilityLoading(true);
      setAvailabilityError(null);

      try {
        const supabase = getSupabaseBrowserClient();
        const rangeStart = toIsoDate(getToday());
        const rangeEnd = toIsoDate(
          getMonthEnd(
            addMonths(getMonthStart(getToday()), appointmentConfig.maxMonthsAhead),
          ),
        );
        const { data, error } = await supabase
          .from("availability_slots")
          .select(
            "id, date, morning_available, afternoon_available, note, created_at, updated_at",
          )
          .gte("date", rangeStart)
          .lte("date", rangeEnd)
          .order("date", { ascending: true });

        if (error) {
          throw error;
        }

        if (!isActive) {
          return;
        }

        const nextAvailability = (data ?? []) as AvailabilitySlot[];

        setAvailabilitySlots(nextAvailability);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Failed to load public availability", error);
        setAvailabilityError(
          "No se pudo cargar la disponibilidad. Intentalo de nuevo dentro de un momento.",
        );
      } finally {
        if (isActive) {
          setAvailabilityLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const currentMonth = addMonths(getMonthStart(getToday()), monthOffset);
    const nextDate = getFirstAvailableDateForMonth(currentMonth, availabilitySlots);

    if (!selectedDate || !isSameMonth(parseIsoDate(selectedDate), currentMonth)) {
      setSelectedDate(nextDate);
    }
  }, [availabilitySlots, monthOffset, selectedDate]);

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setFeedback(null);
    setFieldErrors((current) => ({ ...current, selectedSlots: undefined }));
  }

  function handleToggleSlot(slot: SelectedSlot) {
    setSelectedSlots((current) => {
      const exists = current.some(
        (item) => item.date === slot.date && item.period === slot.period,
      );

      if (exists) {
        return current.filter(
          (item) => !(item.date === slot.date && item.period === slot.period),
        );
      }

      return normalizeSelectedSlots([...current, slot]);
    });

    setFeedback(null);
    setFieldErrors((current) => ({ ...current, selectedSlots: undefined }));
  }

  function handleFieldChange<Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) {
    setFormState((current) => ({ ...current, [key]: value }));
    setFeedback(null);

    if (key === "firstName" || key === "phone" || key === "designStatus") {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = sanitizeAppointmentPayload({
      firstName: formState.firstName,
      lastName: formState.lastName,
      phone: formState.phone,
      designStatus: isDesignStatus(formState.designStatus)
        ? formState.designStatus
        : "unsure",
      comment: formState.comment,
      selectedSlots,
    });
    const validationErrors = validateAppointmentRequestPayload(payload);

    if (!isDesignStatus(formState.designStatus)) {
      validationErrors.designStatus = "Selecciona si tienes el diseño pensado.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setFeedback({
        type: "error",
        message: "Revisa los campos marcados antes de enviar la solicitud.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/appointment-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await parseApiResponse(response);

      if (!response.ok || !result?.ok) {
        setFieldErrors(result?.fieldErrors ?? {});
        throw new Error(
          result?.error ??
            "No se pudo enviar la solicitud. Inténtalo de nuevo en unos minutos.",
        );
      }

      setFormState(INITIAL_FORM_STATE);
      setSelectedSlots([]);
      setFieldErrors({});
      setFeedback({
        type: "success",
        message: appointmentConfig.successMessage,
        warning: result.warning,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo enviar la solicitud. Inténtalo de nuevo en unos minutos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-soft-border bg-white p-3.5 shadow-[0_24px_70px_rgba(136,103,110,0.08)] sm:p-5">
      <div className="petal-grid rounded-[1.5rem] border border-soft-border bg-warm-white p-4 sm:p-5 lg:p-6">
        <p className="text-sm leading-7 text-muted">{appointmentConfig.helperText}</p>

        {feedback && (
          <div
            className={cn(
              "mt-5 rounded-[1.35rem] border px-4 py-4 text-sm leading-7",
              feedback.type === "success"
                ? "border-[#c7dece] bg-[#eef7f0] text-foreground"
                : "border-[#e7b8bf] bg-[#fff3f5] text-foreground",
            )}
          >
            <p className="font-medium">{feedback.message}</p>
            {feedback.warning ? (
              <p className="mt-2 text-sm text-muted">{feedback.warning}</p>
            ) : null}
            {feedback.type === "success" && siteConfig.whatsappUrl ? (
              <div className="mt-4">
                <ButtonLink
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  aria-label="Abrir WhatsApp con Sara en una nueva pestaña"
                  variant="secondary"
                >
                  Abrir WhatsApp
                </ButtonLink>
              </div>
            ) : null}
          </div>
        )}

        {availabilityError ? (
          <div className="mt-6 rounded-[1.4rem] border border-dashed border-soft-border bg-white px-5 py-5 text-sm leading-7 text-muted">
            {availabilityError}
          </div>
        ) : availabilityLoading ? (
          <div className="mt-6 rounded-[1.4rem] border border-soft-border bg-white px-5 py-6 text-sm leading-7 text-muted">
            Cargando disponibilidad...
          </div>
        ) : (
          <div className="mt-6 space-y-4 sm:space-y-5">
            <div className="min-w-0">
              <AppointmentCalendar
                month={visibleMonth}
                selectedDate={selectedDate}
                availabilityByDate={availabilityByDate}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                onPrevious={() => setMonthOffset((current) => Math.max(0, current - 1))}
                onNext={() =>
                  setMonthOffset((current) =>
                    Math.min(appointmentConfig.maxMonthsAhead, current + 1),
                  )
                }
                onSelectDate={handleSelectDate}
              />
            </div>

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              <div className="min-w-0">
                <AppointmentTimeSlots
                  activeDate={selectedDate}
                  availability={activeAvailability}
                  selectedSlots={selectedSlots}
                  onToggleSlot={handleToggleSlot}
                />
              </div>

              <div className="min-w-0 rounded-[1.6rem] border border-soft-border bg-white px-4 py-4 shadow-[0_16px_40px_rgba(136,103,110,0.05)] sm:px-5 sm:py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                      Resumen
                    </p>
                    <h3 className="mt-2 font-display text-[1.85rem] tracking-[-0.04em] text-foreground sm:text-3xl">
                      Tus franjas
                    </h3>
                  </div>
                  <span className="rounded-full border border-soft-border bg-warm-white px-3 py-2 text-sm text-muted">
                    {selectedSlots.length}
                  </span>
                </div>

                {selectedSlots.length === 0 ? (
                  <p className="mt-4 text-sm leading-7 text-muted">
                    Aun no has seleccionado ninguna franja.
                  </p>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {normalizeSelectedSlots(selectedSlots).map((slot) => (
                      <button
                        key={`${slot.date}-${slot.period}`}
                        type="button"
                        className="rounded-full border border-soft-border bg-warm-white px-3 py-2 text-sm text-foreground hover:border-sakura-strong"
                        onClick={() => handleToggleSlot(slot)}
                        aria-label={`Quitar ${slot.date} ${slot.period}`}
                      >
                        {slot.date} · {slot.period === "morning" ? "Mañana" : "Tarde"} ×
                      </button>
                    ))}
                  </div>
                )}
                {fieldErrors.selectedSlots ? (
                  <p className="mt-3 text-sm text-[#b86473]">
                    {fieldErrors.selectedSlots}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 xl:grid-cols-2">
            <label className="block text-sm font-medium text-foreground">
              Nombre *
              <input
                type="text"
                name="firstName"
                value={formState.firstName}
                onChange={(event) =>
                  handleFieldChange("firstName", event.target.value)
                }
                className={baseFieldClassName}
                autoComplete="given-name"
              />
              {fieldErrors.firstName ? (
                <span className="mt-2 block text-sm text-[#b86473]">
                  {fieldErrors.firstName}
                </span>
              ) : null}
            </label>

            <label className="block text-sm font-medium text-foreground">
              Apellidos
              <input
                type="text"
                name="lastName"
                value={formState.lastName}
                onChange={(event) =>
                  handleFieldChange("lastName", event.target.value)
                }
                className={baseFieldClassName}
                autoComplete="family-name"
              />
            </label>

            <label className="block text-sm font-medium text-foreground">
              Telefono *
              <input
                type="tel"
                name="phone"
                value={formState.phone}
                onChange={(event) => handleFieldChange("phone", event.target.value)}
                className={baseFieldClassName}
                autoComplete="tel"
              />
              {fieldErrors.phone ? (
                <span className="mt-2 block text-sm text-[#b86473]">
                  {fieldErrors.phone}
                </span>
              ) : null}
            </label>

            <fieldset className="block text-sm font-medium text-foreground">
              <legend>¿Tienes ya el diseño pensado? *</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 min-[1400px]:grid-cols-3">
                {[
                  { value: "yes", label: "Sí" },
                  { value: "no", label: "No" },
                  { value: "unsure", label: "Más o menos" },
                ].map((option) => {
                  const checked = formState.designStatus === option.value;

                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "cursor-pointer rounded-[1.1rem] border px-4 py-3 text-sm leading-6",
                        checked
                          ? "border-foreground bg-foreground text-warm-white"
                          : "border-soft-border bg-warm-white text-foreground hover:border-sakura-strong",
                      )}
                    >
                      <input
                        type="radio"
                        name="designStatus"
                        value={option.value}
                        checked={checked}
                        className="sr-only"
                        onChange={() =>
                          handleFieldChange(
                            "designStatus",
                            option.value as DesignStatus,
                          )
                        }
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
              {fieldErrors.designStatus ? (
                <span className="mt-2 block text-sm text-[#b86473]">
                  {fieldErrors.designStatus}
                </span>
              ) : null}
            </fieldset>
          </div>

          <label className="mt-4 block text-sm font-medium text-foreground">
            Comentario
            <textarea
              name="comment"
              rows={5}
              value={formState.comment}
              onChange={(event) => handleFieldChange("comment", event.target.value)}
              className={cn(baseFieldClassName, "resize-none")}
              placeholder="Cuéntame tu idea, la zona del cuerpo o cualquier detalle que te ayude a explicarte."
            />
          </label>

          <p className="mt-4 text-sm leading-7 text-muted">
            {appointmentConfig.privacyNote}
          </p>

          <div className="mt-6 flex flex-col gap-3 min-[1400px]:flex-row min-[1400px]:items-center">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-transparent bg-foreground px-6 py-3 text-sm font-semibold tracking-[0.02em] text-warm-white shadow-[0_12px_30px_rgba(87,71,71,0.06)] hover:-translate-y-0.5 hover:bg-[#2b2929] hover:shadow-[0_18px_36px_rgba(87,71,71,0.1)] disabled:cursor-not-allowed disabled:opacity-70 min-[1400px]:w-auto"
              disabled={isSubmitting || availabilityLoading}
            >
              {isSubmitting ? "Enviando..." : appointmentConfig.submitLabel}
            </button>
            <p className="text-sm leading-7 text-muted">
              Esta solicitud no confirma la cita automáticamente. Sara te
              escribirá después para concretarla.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
