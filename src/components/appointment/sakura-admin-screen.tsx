"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { AdminAvailabilityCalendar } from "@/components/appointment/admin-availability-calendar";
import { AdminLogin } from "@/components/appointment/admin-login";
import { AdminRequestsList } from "@/components/appointment/admin-requests-list";
import { Container } from "@/components/container";
import { PetalCluster } from "@/components/petal-cluster";
import { SakuraBranch } from "@/components/sakura-branch";
import { appointmentConfig } from "@/config/appointment";
import { BRAND_NAME } from "@/config/site";
import {
  isDesignStatus,
  isRequestStatus,
  normalizeSelectedSlots,
  type AppointmentPeriod,
  type AppointmentRequestRecord,
  type AppointmentRequestStatus,
  type AvailabilitySlot,
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

function getFirstEditableDateForMonth(month: Date) {
  return (
    getMonthDays(month).find((day) => day.isCurrentMonth && !day.isPast)?.iso ??
    null
  );
}

function getDraftFromAvailability(slot?: AvailabilitySlot | null) {
  return {
    morning_available: slot?.morning_available ?? false,
    afternoon_available: slot?.afternoon_available ?? false,
  };
}

function upsertAvailabilitySlot(
  currentSlots: AvailabilitySlot[],
  nextSlot: AvailabilitySlot,
) {
  const remaining = currentSlots.filter((slot) => slot.date !== nextSlot.date);
  return [...remaining, nextSlot].sort((left, right) =>
    left.date.localeCompare(right.date),
  );
}

export function SakuraAdminScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(
    [],
  );
  const [requests, setRequests] = useState<AppointmentRequestRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    toIsoDate(getToday()),
  );
  const [draftAvailability, setDraftAvailability] = useState({
    morning_available: false,
    afternoon_available: false,
  });
  const [availabilityMessage, setAvailabilityMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);

  const visibleMonth = addMonths(getMonthStart(getToday()), monthOffset);
  const availabilityByDate = new Map(
    availabilitySlots.map((slot) => [slot.date, slot]),
  );
  const canGoPrevious = monthOffset > 0;
  const canGoNext = monthOffset < appointmentConfig.maxMonthsAhead;

  useEffect(() => {
    let isActive = true;
    let unsubscribe: (() => void) | null = null;

    async function bootstrapSession() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (!isActive) {
          return;
        }

        if (error) {
          throw error;
        }

        setSession(currentSession);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Failed to bootstrap admin session", error);
        setAuthError(
          "No se pudo iniciar el panel admin. Revisa la configuracion publica de Supabase.",
        );
      } finally {
        if (isActive) {
          setIsBooting(false);
        }
      }
    }

    void bootstrapSession();

    try {
      const supabase = getSupabaseBrowserClient();
      const listener = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!isActive) {
          return;
        }

        setSession(nextSession);
        setIsBooting(false);

        if (!nextSession) {
          setAvailabilitySlots([]);
          setRequests([]);
        }
      });

      unsubscribe = () => listener.data.subscription.unsubscribe();
    } catch (error) {
      console.error("Failed to subscribe to auth state changes", error);
    }

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const currentMonth = addMonths(getMonthStart(getToday()), monthOffset);
    const nextDate = getFirstEditableDateForMonth(currentMonth);

    if (!selectedDate || !isSameMonth(parseIsoDate(selectedDate), currentMonth)) {
      setSelectedDate(nextDate);
      setAvailabilityMessage(null);
    }
  }, [monthOffset, selectedDate]);

  useEffect(() => {
    const currentSlot = selectedDate
      ? availabilitySlots.find((slot) => slot.date === selectedDate) ?? null
      : null;

    setDraftAvailability(getDraftFromAvailability(currentSlot));
  }, [availabilitySlots, selectedDate]);

  useEffect(() => {
    if (!session) {
      return;
    }

    let isActive = true;

    async function loadAdminData() {
      setIsLoadingData(true);
      setDataError(null);

      try {
        const supabase = getSupabaseBrowserClient();
        const rangeStart = toIsoDate(getMonthStart(getToday()));
        const rangeEnd = toIsoDate(
          getMonthEnd(
            addMonths(getMonthStart(getToday()), appointmentConfig.maxMonthsAhead),
          ),
        );
        const [availabilityResult, requestsResult] = await Promise.all([
          supabase
            .from("availability_slots")
            .select(
              "id, date, morning_available, afternoon_available, note, created_at, updated_at",
            )
            .gte("date", rangeStart)
            .lte("date", rangeEnd)
            .order("date", { ascending: true }),
          supabase
            .from("appointment_requests")
            .select(
              "id, first_name, last_name, phone, design_status, comment, selected_slots, status, created_at",
            )
            .order("created_at", { ascending: false }),
        ]);

        if (availabilityResult.error) {
          throw availabilityResult.error;
        }

        if (requestsResult.error) {
          throw requestsResult.error;
        }

        if (!isActive) {
          return;
        }

        setAvailabilitySlots((availabilityResult.data ?? []) as AvailabilitySlot[]);
        setRequests(
          (requestsResult.data ?? []).map((item) => ({
            ...item,
            design_status: isDesignStatus(item.design_status)
              ? item.design_status
              : "unsure",
            status: isRequestStatus(item.status) ? item.status : "pending",
            selected_slots: normalizeSelectedSlots(item.selected_slots),
          })) as AppointmentRequestRecord[],
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Failed to load admin data", error);
        setDataError(
          "No se pudieron cargar la disponibilidad o las solicitudes del panel.",
        );
      } finally {
        if (isActive) {
          setIsLoadingData(false);
        }
      }
    }

    void loadAdminData();

    return () => {
      isActive = false;
    };
  }, [session]);

  async function handleLogin(credentials: { email: string; password: string }) {
    setIsSigningIn(true);
    setAuthError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Admin sign in failed", error);
      setAuthError(
        "No se pudo iniciar sesion. Revisa el email, la contraseña y la configuracion de Supabase Auth.",
      );
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Admin sign out failed", error);
      setAuthError("No se pudo cerrar la sesion.");
    } finally {
      setIsSigningOut(false);
    }
  }

  function handleTogglePeriod(period: AppointmentPeriod) {
    setDraftAvailability((current) => ({
      ...current,
      morning_available:
        period === "morning"
          ? !current.morning_available
          : current.morning_available,
      afternoon_available:
        period === "afternoon"
          ? !current.afternoon_available
          : current.afternoon_available,
    }));
    setAvailabilityMessage(null);
  }

  async function handleSaveAvailability() {
    if (!selectedDate) {
      return;
    }

    setIsSavingAvailability(true);
    setAvailabilityMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();

      if (
        !draftAvailability.morning_available &&
        !draftAvailability.afternoon_available
      ) {
        const { error } = await supabase
          .from("availability_slots")
          .delete()
          .eq("date", selectedDate);

        if (error) {
          throw error;
        }

        setAvailabilitySlots((current) =>
          current.filter((slot) => slot.date !== selectedDate),
        );
        setAvailabilityMessage({
          type: "success",
          text: "Dia limpiado correctamente.",
        });
        return;
      }

      const { data, error } = await supabase
        .from("availability_slots")
        .upsert(
          {
            date: selectedDate,
            morning_available: draftAvailability.morning_available,
            afternoon_available: draftAvailability.afternoon_available,
            note: null,
          },
          {
            onConflict: "date",
          },
        )
        .select(
          "id, date, morning_available, afternoon_available, note, created_at, updated_at",
        )
        .single();

      if (error || !data) {
        throw error;
      }

      setAvailabilitySlots((current) =>
        upsertAvailabilitySlot(current, data as AvailabilitySlot),
      );
      setAvailabilityMessage({
        type: "success",
        text: "Disponibilidad guardada correctamente.",
      });
    } catch (error) {
      console.error("Saving availability failed", error);
      setAvailabilityMessage({
        type: "error",
        text: "No se pudo guardar la disponibilidad.",
      });
    } finally {
      setIsSavingAvailability(false);
    }
  }

  async function handleClearAvailability() {
    if (!selectedDate) {
      return;
    }

    setIsSavingAvailability(true);
    setAvailabilityMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("availability_slots")
        .delete()
        .eq("date", selectedDate);

      if (error) {
        throw error;
      }

      setAvailabilitySlots((current) =>
        current.filter((slot) => slot.date !== selectedDate),
      );
      setDraftAvailability({
        morning_available: false,
        afternoon_available: false,
      });
      setAvailabilityMessage({
        type: "success",
        text: "Dia limpiado correctamente.",
      });
    } catch (error) {
      console.error("Clearing availability failed", error);
      setAvailabilityMessage({
        type: "error",
        text: "No se pudo limpiar este dia.",
      });
    } finally {
      setIsSavingAvailability(false);
    }
  }

  async function handleStatusChange(
    requestId: string,
    status: AppointmentRequestStatus,
  ) {
    setUpdatingRequestId(requestId);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("appointment_requests")
        .update({ status })
        .eq("id", requestId)
        .select(
          "id, first_name, last_name, phone, design_status, comment, selected_slots, status, created_at",
        )
        .single();

      if (error || !data) {
        throw error;
      }

      setRequests((current) =>
        current.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: isRequestStatus(data.status) ? data.status : request.status,
              }
            : request,
        ),
      );
    } catch (error) {
      console.error("Updating request status failed", error);
      setDataError("No se pudo actualizar el estado de la solicitud.");
    } finally {
      setUpdatingRequestId(null);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background py-12">
      <PetalCluster className="-left-10 top-10 hidden opacity-60 lg:block" />
      <PetalCluster className="right-0 top-24 hidden scale-[0.95] opacity-45 lg:block" />
      <SakuraBranch className="left-0 bottom-16 hidden opacity-40 xl:block" />
      <SakuraBranch className="right-3 bottom-10 hidden opacity-38 xl:block" mirrored />

      <Container className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Panel privado
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl">
              {BRAND_NAME}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
              Gestiona disponibilidad y solicitudes de cita desde un espacio
              privado conectado a Supabase.
            </p>
          </div>

          {session ? (
            <button
              type="button"
              className={cn(
                "inline-flex min-h-12 items-center justify-center rounded-full border border-transparent bg-foreground px-6 py-3 text-sm font-semibold tracking-[0.02em] text-warm-white shadow-[0_12px_30px_rgba(87,71,71,0.06)] hover:-translate-y-0.5 hover:bg-[#2b2929] hover:shadow-[0_18px_36px_rgba(87,71,71,0.1)]",
                isSigningOut && "cursor-not-allowed opacity-70",
              )}
              onClick={() => void handleSignOut()}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Cerrando..." : "Cerrar sesión"}
            </button>
          ) : null}
        </div>

        {isBooting ? (
          <div className="mt-10 rounded-[2rem] border border-soft-border bg-white px-6 py-8 text-sm leading-7 text-muted shadow-[0_24px_70px_rgba(136,103,110,0.08)]">
            Cargando panel privado...
          </div>
        ) : !session ? (
          <div className="mt-10">
            <AdminLogin
              isSubmitting={isSigningIn}
              errorMessage={authError}
              onSubmit={handleLogin}
            />
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {dataError ? (
              <div className="rounded-[1.5rem] border border-[#e7b8bf] bg-[#fff3f5] px-5 py-4 text-sm leading-7 text-foreground">
                {dataError}
              </div>
            ) : null}

            {isLoadingData ? (
              <div className="rounded-[2rem] border border-soft-border bg-white px-6 py-8 text-sm leading-7 text-muted shadow-[0_24px_70px_rgba(136,103,110,0.08)]">
                Cargando disponibilidad y solicitudes...
              </div>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
              <AdminAvailabilityCalendar
                month={visibleMonth}
                selectedDate={selectedDate}
                availabilityByDate={availabilityByDate}
                draftAvailability={draftAvailability}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                isSaving={isSavingAvailability}
                message={availabilityMessage}
                onPrevious={() => setMonthOffset((current) => Math.max(0, current - 1))}
                onNext={() =>
                  setMonthOffset((current) =>
                    Math.min(appointmentConfig.maxMonthsAhead, current + 1),
                  )
                }
                onSelectDate={setSelectedDate}
                onTogglePeriod={handleTogglePeriod}
                onSave={handleSaveAvailability}
                onClear={handleClearAvailability}
              />

              <AdminRequestsList
                requests={requests}
                updatingRequestId={updatingRequestId}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
