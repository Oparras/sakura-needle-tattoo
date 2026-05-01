import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary:
    "border-transparent bg-foreground text-warm-white hover:-translate-y-0.5 hover:bg-[#2b2929]",
  secondary:
    "border-soft-border bg-white/75 text-foreground hover:-translate-y-0.5 hover:border-sakura-strong hover:bg-white",
  ghost:
    "border-transparent bg-transparent px-0 text-foreground hover:text-muted",
} as const;

export function ButtonLink({
  className,
  variant = "primary",
  children,
  rel,
  target,
  ...props
}: ButtonLinkProps) {
  const safeRel =
    target === "_blank"
      ? Array.from(
          new Set([...(rel?.split(" ") ?? []), "noopener", "noreferrer"]),
        ).join(" ")
      : rel;

  return (
    <a
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold tracking-[0.02em] shadow-[0_12px_30px_rgba(87,71,71,0.06)] hover:shadow-[0_18px_36px_rgba(87,71,71,0.1)] motion-reduce:hover:translate-y-0",
        variants[variant],
        className,
      )}
      rel={safeRel}
      target={target}
      {...props}
    >
      {children}
    </a>
  );
}
