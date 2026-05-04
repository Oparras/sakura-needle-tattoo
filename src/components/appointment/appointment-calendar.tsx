"use client";

import {
  hasAvailablePeriods,
  type AvailabilitySlot,
} from "@/lib/appointments";
import {
  WEEKDAY_LABELS,
  formatAppointmentDate,
  formatMonthLabel,
  getMonthDays,
} from "@/lib/date";
import { cn } from "@/lib/utils";

type AppointmentCalendarProps = {
  month: Date;
  selectedDate: string | null;
  availabilityByDate: Map<
    string,
    Pick<AvailabilitySlot, "morning_available" | "afternoon_available">
  >;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSelectDate: (isoDate: string) => void;
};

export function AppointmentCalendar({
  month,
  selectedDate,
  availabilityByDate,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onSelectDate,
}: AppointmentCalendarProps) {
  const monthDays = getMonthDays(month);
  const monthHasAvailability = monthDays.some((day) => {
    const availability = availabilityByDate.get(day.iso);
    return day.isCurrentMonth && !day.isPast && hasAvailablePeriods(availability);
  });

  return (
    <div className="rounded-[1.7rem] border border-soft-border bg-white p-4 shadow-[0_18px_50px_rgba(136,103,110,0.06)] sm:p-5 lg:p-6">
      <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Calendario
          </p>
          <h3 className="mt-2 font-display text-[1.9rem] tracking-[-0.04em] text-foreground sm:mt-3 sm:text-4xl">
            {formatMonthLabel(month)}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border bg-warm-white text-lg text-foreground sm:h-11 sm:w-11",
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
              "inline-flex h-10 w-10 items-center justify-center rounded-full border bg-warm-white text-lg text-foreground sm:h-11 sm:w-11",
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

      <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted sm:mt-6 sm:gap-2 sm:text-[0.72rem] sm:tracking-[0.18em]">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
        {monthDays.map((day) => {
          const availability = availabilityByDate.get(day.iso);
          const isAvailable =
            day.isCurrentMonth && !day.isPast && hasAvailablePeriods(availability);
          const isSelected = selectedDate === day.iso;
          const availabilityCount =
            Number(Boolean(availability?.morning_available)) +
            Number(Boolean(availability?.afternoon_available));
          const ariaLabel = `${formatAppointmentDate(day.iso)}${
            isAvailable ? ", disponible" : ", no disponible"
          }`;

          return (
            <button
              key={day.iso}
              type="button"
              className={cn(
                "group relative min-h-[4rem] rounded-[1rem] border px-1.5 py-2.5 text-left sm:min-h-[4.35rem] sm:rounded-[1.1rem] sm:px-2 sm:py-3",
                !day.isCurrentMonth &&
                  "cursor-default border-transparent bg-transparent text-muted/35",
                day.isCurrentMonth &&
                  !isAvailable &&
                  !isSelected &&
                  "cursor-not-allowed border-soft-border/70 bg-warm-white/75 text-muted/55",
                isAvailable &&
                  !isSelected &&
                  "border-[#c7dece] bg-[#eef7f0] text-foreground hover:-translate-y-0.5 hover:border-[#9fc2ac] hover:shadow-[0_16px_28px_rgba(92,141,108,0.12)]",
                isSelected &&
                  "border-foreground bg-foreground text-warm-white shadow-[0_18px_34px_rgba(31,30,30,0.14)]",
              )}
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelectDate(day.iso)}
              aria-label={ariaLabel}
              aria-pressed={isSelected}
            >
              <span className="text-sm font-semibold sm:text-[0.95rem]">{day.dayNumber}</span>
              {day.isToday && (
                <span
                  className={cn(
                    "absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full sm:right-3 sm:top-3",
                    isSelected ? "bg-warm-white" : "bg-sakura-strong",
                  )}
                  aria-hidden="true"
                />
              )}
              {isAvailable && (
                <span className="absolute bottom-2.5 left-2 flex items-center gap-1 sm:bottom-3 sm:left-2.5">
                  {Array.from({ length: availabilityCount }).map((_, index) => (
                    <span
                      key={`${day.iso}-${index}`}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isSelected ? "bg-warm-white/90" : "bg-[#79a183]",
                      )}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5 text-sm text-muted sm:mt-6 sm:gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-soft-border bg-warm-white px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#79a183]" />
          Disponible
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-soft-border bg-warm-white px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
          Seleccionado
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-soft-border bg-warm-white px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-soft-border" />
          No disponible
        </span>
      </div>

      {!monthHasAvailability && (
        <p className="mt-6 rounded-[1.3rem] border border-dashed border-soft-border bg-warm-white px-4 py-4 text-sm leading-7 text-muted">
          No hay fechas disponibles este mes. Revisa el siguiente mes o
          escríbeme por Instagram.
        </p>
      )}
    </div>
  );
}
