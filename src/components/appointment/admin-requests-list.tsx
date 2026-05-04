"use client";

import { ButtonLink } from "@/components/button-link";
import {
  REQUEST_STATUSES,
  formatSelectedSlots,
  isRequestStatus,
  mapDesignStatusLabel,
  mapRequestStatusLabel,
  type AppointmentRequestRecord,
  type AppointmentRequestStatus,
} from "@/lib/appointments";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { buildClientWhatsappUrl } from "@/lib/whatsapp";

type AdminRequestsListProps = {
  requests: AppointmentRequestRecord[];
  updatingRequestId: string | null;
  onStatusChange: (
    requestId: string,
    status: AppointmentRequestStatus,
  ) => Promise<void>;
};

function getStatusClasses(status: AppointmentRequestStatus) {
  switch (status) {
    case "pending":
      return "border-[#ead8b5] bg-[#fff9ec] text-[#7a6132]";
    case "contacted":
      return "border-[#d5ddf2] bg-[#f3f7ff] text-[#4f6292]";
    case "confirmed":
      return "border-[#c7dece] bg-[#eef7f0] text-[#4f7a5c]";
    case "cancelled":
      return "border-[#e7c7cc] bg-[#fff3f5] text-[#8f5560]";
    default:
      return "border-soft-border bg-warm-white text-foreground";
  }
}

export function AdminRequestsList({
  requests,
  updatingRequestId,
  onStatusChange,
}: AdminRequestsListProps) {
  return (
    <div className="rounded-[2rem] border border-soft-border bg-white p-5 shadow-[0_24px_70px_rgba(136,103,110,0.08)] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Solicitudes
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.04em] text-foreground">
            Solicitudes recibidas
          </h2>
        </div>
        <span className="rounded-full border border-soft-border bg-warm-white px-4 py-2 text-sm text-muted">
          {requests.length}
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="mt-6 rounded-[1.4rem] border border-dashed border-soft-border bg-warm-white px-5 py-5 text-sm leading-7 text-muted">
          Todavía no hay solicitudes recibidas.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {requests.map((request) => {
            const whatsappUrl = buildClientWhatsappUrl(
              request.phone,
              request.first_name,
            );
            const isUpdating = updatingRequestId === request.id;

            return (
              <article
                key={request.id}
                className="rounded-[1.6rem] border border-soft-border bg-warm-white p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-3xl tracking-[-0.04em] text-foreground">
                        {[request.first_name, request.last_name]
                          .filter(Boolean)
                          .join(" ")}
                      </h3>
                      <span
                        className={cn(
                          "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em]",
                          getStatusClasses(request.status),
                        )}
                      >
                        {mapRequestStatusLabel(request.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      Recibida el {formatDateTime(request.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {whatsappUrl ? (
                      <ButtonLink
                        href={whatsappUrl}
                        target="_blank"
                        aria-label={`Abrir WhatsApp con ${request.first_name} en una nueva pestaña`}
                        variant="secondary"
                      >
                        Abrir WhatsApp
                      </ButtonLink>
                    ) : null}

                    <label className="text-sm font-medium text-foreground">
                      Estado
                      <select
                        value={request.status}
                        className="ml-0 mt-2 block min-w-[12rem] rounded-full border border-soft-border bg-white px-4 py-3 text-sm text-foreground shadow-[0_10px_24px_rgba(136,103,110,0.04)]"
                        onChange={(event) => {
                          if (isRequestStatus(event.target.value)) {
                            void onStatusChange(request.id, event.target.value);
                          }
                        }}
                        disabled={isUpdating}
                      >
                        {REQUEST_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {mapRequestStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.3rem] border border-soft-border bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                      Teléfono
                    </p>
                    <p className="mt-2 text-base leading-7 text-foreground">
                      {request.phone}
                    </p>
                  </div>

                  <div className="rounded-[1.3rem] border border-soft-border bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                      Diseño pensado
                    </p>
                    <p className="mt-2 text-base leading-7 text-foreground">
                      {mapDesignStatusLabel(request.design_status)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.3rem] border border-soft-border bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    Disponibilidad elegida
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-foreground">
                    {formatSelectedSlots(request.selected_slots).map((slot) => (
                      <li key={`${request.id}-${slot}`}>• {slot}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 rounded-[1.3rem] border border-soft-border bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    Comentario
                  </p>
                  <p className="mt-3 text-sm leading-7 text-foreground">
                    {request.comment?.trim() || "Sin comentario."}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
