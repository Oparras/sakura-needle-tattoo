"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type AdminLoginProps = {
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
};

const fieldClassName =
  "mt-2 w-full rounded-[1.2rem] border border-soft-border bg-warm-white px-4 py-3 text-sm text-foreground shadow-[0_10px_24px_rgba(136,103,110,0.04)] placeholder:text-muted/70";

export function AdminLogin({
  isSubmitting,
  errorMessage,
  onSubmit,
}: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ email, password });
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-soft-border bg-white p-6 shadow-[0_24px_70px_rgba(136,103,110,0.08)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
        Sakura admin
      </p>
      <h1 className="mt-4 font-display text-4xl leading-[0.94] tracking-[-0.04em] text-foreground sm:text-5xl">
        Acceso privado para Sara
      </h1>
      <p className="mt-4 text-base leading-8 text-muted">
        Entra con tu email y contraseña de Supabase Auth para gestionar
        disponibilidad y revisar solicitudes.
      </p>

      {errorMessage ? (
        <div className="mt-5 rounded-[1.35rem] border border-[#e7b8bf] bg-[#fff3f5] px-4 py-4 text-sm leading-7 text-foreground">
          {errorMessage}
        </div>
      ) : null}

      <form className="mt-6" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-foreground">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClassName}
            autoComplete="email"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-foreground">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClassName}
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          className={cn(
            "mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-transparent bg-foreground px-6 py-3 text-sm font-semibold tracking-[0.02em] text-warm-white shadow-[0_12px_30px_rgba(87,71,71,0.06)] hover:-translate-y-0.5 hover:bg-[#2b2929] hover:shadow-[0_18px_36px_rgba(87,71,71,0.1)]",
            isSubmitting && "cursor-not-allowed opacity-70",
          )}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
