"use client";

import {
  getSelectedSlotKey,
  type AvailabilitySlot,
  type SelectedSlot,
} from "@/lib/appointments";
import { formatAppointmentDate } from "@/lib/date";
import { cn } from "@/lib/utils";

type AppointmentTimeSlotsProps = {
  activeDate: string | null;
  availability?: Pick<
    AvailabilitySlot,
    "morning_available" | "afternoon_available"
  > | null;
  selectedSlots: SelectedSlot[];
  onToggleSlot: (slot: SelectedSlot) => void;
};

const SLOT_OPTIONS = [
  { period: "morning", label: "Mañana" },
  { period: "afternoon", label: "Tarde" },
] as const;

export function AppointmentTimeSlots({
  activeDate,
  availability,
  selectedSlots,
  onToggleSlot,
}: AppointmentTimeSlotsProps) {
  if (!activeDate) {
    return (
      <div className="rounded-[1.6rem] border border-soft-border bg-warm-white px-4 py-5 text-sm leading-6 text-muted sm:px-5 sm:py-6 sm:leading-7">
        Selecciona un día disponible para ver las franjas de mañana o tarde.
      </div>
    );
  }

  return (
    <div className="rounded-[1.6rem] border border-soft-border bg-white px-4 py-5 shadow-[0_16px_40px_rgba(136,103,110,0.05)] sm:px-5 sm:py-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
        Franjas disponibles
      </p>
      <h3 className="mt-3 font-display text-[1.85rem] tracking-[-0.04em] text-foreground sm:text-3xl">
        {formatAppointmentDate(activeDate)}
      </h3>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {SLOT_OPTIONS.map((option) => {
          const slot = { date: activeDate, period: option.period };
          const isEnabled =
            option.period === "morning"
              ? Boolean(availability?.morning_available)
              : Boolean(availability?.afternoon_available);
          const isSelected = selectedSlots.some(
            (item) => getSelectedSlotKey(item) === getSelectedSlotKey(slot),
          );

          return (
            <button
              key={option.period}
              type="button"
              disabled={!isEnabled}
              aria-pressed={isSelected}
              className={cn(
                "rounded-[1.35rem] border px-4 py-4 text-left",
                !isEnabled &&
                  "cursor-not-allowed border-soft-border/70 bg-warm-white text-muted/55",
                isEnabled &&
                  !isSelected &&
                  "border-soft-border bg-warm-white text-foreground hover:-translate-y-0.5 hover:border-sakura-strong hover:shadow-[0_16px_28px_rgba(136,103,110,0.08)]",
                isSelected &&
                  "border-foreground bg-foreground text-warm-white shadow-[0_18px_34px_rgba(31,30,30,0.14)]",
              )}
              onClick={() => isEnabled && onToggleSlot(slot)}
            >
              <span className="block text-sm font-semibold uppercase tracking-[0.18em]">
                {option.label}
              </span>
              <span
                className={cn(
                  "mt-2 block text-sm",
                  isSelected ? "text-warm-white/80" : "text-muted",
                )}
              >
                {isEnabled
                  ? isSelected
                    ? "Seleccionada"
                    : "Disponible para solicitar"
                  : "No disponible"}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
