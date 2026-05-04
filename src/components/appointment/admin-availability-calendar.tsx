"use client";

import {
  hasAvailablePeriods,
  mapPeriodLabel,
  type AppointmentPeriod,
  type AvailabilitySlot,
} from "@/lib/appointments";
import {
  WEEKDAY_LABELS,
  formatAppointmentDate,
  formatMonthLabel,
  getMonthDays,
} from "@/lib/date";
import { cn } from "@/lib/utils";

type AdminAvailabilityCalendarProps = {
  month: Date;
  selectedDate: string | null;
  availabilityByDate: Map<string, AvailabilitySlot>;
  draftAvailability: {
    morning_available: boolean;
    afternoon_available: boolean;
  };
  canGoPrevious: boolean;
  canGoNext: boolean;
  isSaving: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onPrevious: () => void;
  onNext: () => void;
  onSelectDate: (isoDate: string) => void;
  onTogglePeriod: (period: AppointmentPeriod) => void;
  onSave: () => Promise<void>;
  onClear: () => Promise<void>;
};

const SLOT_PERIODS = ["morning", "afternoon"] as const;

export function AdminAvailabilityCalendar({
  month,
  selectedDate,
  availabilityByDate,
  draftAvailability,
  canGoPrevious,
  canGoNext,
  isSaving,
  message,
  onPrevious,
  onNext,
  onSelectDate,
  onTogglePeriod,
  onSave,
  onClear,
}: AdminAvailabilityCalendarProps) {
  const monthDays = getMonthDays(month);

  return (
    <div className="rounded-[2rem] border border-soft-border bg-white p-5 shadow-[0_24px_70px_rgba(136,103,110,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Disponibilidad
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.04em] text-foreground">
            {formatMonthLabel(month)}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border bg-warm-white text-lg text-foreground",
              canGoPrevious
                ? "border-soft-border hover:-translate-y-0.5 hover:border-sakura-strong"
                : "cursor-not-allowed border-soft-border/70 text-muted/50",
            )}
            onClick={onPrevious}
            disabled={!canGoPrevious}
            aria-label="Ir al mes anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border bg-warm-white text-lg text-foreground",
              canGoNext
                ? "border-soft-border hover:-translate-y-0.5 hover:border-sakura-strong"
                : "cursor-not-allowed border-soft-border/70 text-muted/50",
            )}
            onClick={onNext}
            disabled={!canGoNext}
            aria-label="Ir al mes siguiente"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {monthDays.map((day) => {
          const availability = availabilityByDate.get(day.iso);
          const isSelected = selectedDate === day.iso;
          const canSelect = day.isCurrentMonth && !day.isPast;

          return (
            <button
              key={day.iso}
              type="button"
              disabled={!canSelect}
              className={cn(
                "relative min-h-[4.35rem] rounded-[1.1rem] border px-2 py-3 text-left",
                !day.isCurrentMonth &&
                  "cursor-default border-transparent bg-transparent text-muted/35",
                day.isCurrentMonth &&
                  day.isPast &&
                  "cursor-not-allowed border-soft-border/70 bg-warm-white/75 text-muted/55",
                canSelect &&
                  !isSelected &&
                  "border-soft-border bg-warm-white text-foreground hover:-translate-y-0.5 hover:border-sakura-strong hover:shadow-[0_16px_28px_rgba(136,103,110,0.08)]",
                isSelected &&
                  "border-foreground bg-foreground text-warm-white shadow-[0_18px_34px_rgba(31,30,30,0.14)]",
              )}
              onClick={() => canSelect && onSelectDate(day.iso)}
              aria-label={formatAppointmentDate(day.iso)}
              aria-pressed={isSelected}
            >
              <span className="text-sm font-semibold">{day.dayNumber}</span>
              {hasAvailablePeriods(availability) ? (
                <span className="absolute bottom-3 left-2.5 flex items-center gap-1">
                  {availability?.morning_available ? (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isSelected ? "bg-warm-white" : "bg-[#79a183]",
                      )}
                    />
                  ) : null}
                  {availability?.afternoon_available ? (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isSelected ? "bg-warm-white" : "bg-[#79a183]",
                      )}
                    />
                  ) : null}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-[1.6rem] border border-soft-border bg-warm-white px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Editor del día
        </p>
        {selectedDate ? (
          <>
            <h3 className="mt-3 font-display text-3xl tracking-[-0.04em] text-foreground">
              {formatAppointmentDate(selectedDate)}
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {SLOT_PERIODS.map((period) => {
                const isEnabled =
                  period === "morning"
                    ? draftAvailability.morning_available
                    : draftAvailability.afternoon_available;

                return (
                  <button
                    key={period}
                    type="button"
                    aria-pressed={isEnabled}
                    onClick={() => onTogglePeriod(period)}
                    className={cn(
                      "rounded-[1.3rem] border px-4 py-4 text-left",
                      isEnabled
                        ? "border-[#c7dece] bg-[#eef7f0] text-foreground"
                        : "border-soft-border bg-white text-muted hover:border-sakura-strong hover:text-foreground",
                    )}
                  >
                    <span className="block text-sm font-semibold uppercase tracking-[0.18em]">
                      {mapPeriodLabel(period)}
                    </span>
                    <span className="mt-2 block text-sm">
                      {isEnabled ? "Disponible" : "No disponible"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-transparent bg-foreground px-6 py-3 text-sm font-semibold tracking-[0.02em] text-warm-white shadow-[0_12px_30px_rgba(87,71,71,0.06)] hover:-translate-y-0.5 hover:bg-[#2b2929] hover:shadow-[0_18px_36px_rgba(87,71,71,0.1)] disabled:cursor-not-allowed disabled:opacity-70"
                onClick={() => void onSave()}
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-soft-border bg-white px-6 py-3 text-sm font-semibold tracking-[0.02em] text-foreground hover:-translate-y-0.5 hover:border-sakura-strong hover:shadow-[0_16px_28px_rgba(136,103,110,0.08)] disabled:cursor-not-allowed disabled:opacity-70"
                onClick={() => void onClear()}
                disabled={isSaving}
              >
                Limpiar día
              </button>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted">
              Si dejas mañana y tarde desactivadas, se limpiará ese día del
              calendario público.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-7 text-muted">
            Selecciona una fecha futura para editar la disponibilidad.
          </p>
        )}

        {message ? (
          <div
            className={cn(
              "mt-5 rounded-[1.2rem] border px-4 py-4 text-sm leading-7",
              message.type === "success"
                ? "border-[#c7dece] bg-[#eef7f0] text-foreground"
                : "border-[#e7b8bf] bg-[#fff3f5] text-foreground",
            )}
          >
            {message.text}
          </div>
        ) : null}
      </div>
    </div>
  );
}
