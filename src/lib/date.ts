export type CalendarDay = {
  date: Date;
  iso: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
};

export const WEEKDAY_LABELS = [
  "Lun",
  "Mar",
  "Mie",
  "Jue",
  "Vie",
  "Sab",
  "Dom",
] as const;

function atStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getToday() {
  return atStartOfDay(new Date());
}

export function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date(Number.NaN);
  }

  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthEnd(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function isSameDay(left: Date, right: Date) {
  return toIsoDate(left) === toIsoDate(right);
}

export function isSameMonth(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}

export function isPastIsoDate(value: string, today = getToday()) {
  return parseIsoDate(value).getTime() < today.getTime();
}

export function formatMonthLabel(value: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(value);
}

export function formatAppointmentDate(value: string | Date) {
  const date = typeof value === "string" ? parseIsoDate(value) : value;

  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getMondayOffset(dayIndex: number) {
  return dayIndex === 0 ? 6 : dayIndex - 1;
}

export function getMonthDays(month: Date) {
  const monthStart = getMonthStart(month);
  const today = getToday();
  const gridStart = new Date(monthStart);

  gridStart.setDate(monthStart.getDate() - getMondayOffset(monthStart.getDay()));

  return Array.from({ length: 42 }, (_, index): CalendarDay => {
    const date = new Date(gridStart);

    date.setDate(gridStart.getDate() + index);

    return {
      date,
      iso: toIsoDate(date),
      dayNumber: date.getDate(),
      isCurrentMonth: isSameMonth(date, monthStart),
      isPast: atStartOfDay(date).getTime() < today.getTime(),
      isToday: isSameDay(date, today),
    };
  });
}
