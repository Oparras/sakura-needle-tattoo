"use client";

import Image from "next/image";
import { useState } from "react";
import { SakuraBranch } from "@/components/sakura-branch";
import { cn } from "@/lib/utils";

type WorkCardMediaProps = {
  src?: string;
  alt: string;
  title: string;
  className?: string;
  sizes: string;
  hasImage?: boolean;
};

function Placeholder({
  alt,
  title,
  className,
}: Omit<WorkCardMediaProps, "sizes" | "src" | "hasImage">) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative h-full w-full overflow-hidden bg-warm-white", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,199,205,0.36),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(231,174,184,0.24),transparent_26%),linear-gradient(145deg,rgba(255,251,252,0.96),rgba(247,238,240,0.92))]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,253,252,0.55)_45%,transparent_100%)]" />
      <SakuraBranch className="right-2 top-3 w-28 opacity-58 sm:w-32" />
      <SakuraBranch className="bottom-1 left-2 w-24 opacity-42" mirrored />
      <div className="absolute left-4 top-4 rounded-full border border-soft-border bg-white/84 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">
        Sakura
      </div>
      <div className="absolute bottom-5 left-5 rounded-[1.25rem] border border-white/65 bg-[rgba(255,253,252,0.86)] px-4 py-3 backdrop-blur-sm">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted">
          Placeholder
        </p>
        <p className="mt-2 font-display text-2xl leading-none tracking-[-0.04em] text-foreground">
          {title}
        </p>
      </div>
    </div>
  );
}

export function WorkCardMedia({
  src,
  alt,
  title,
  className,
  sizes,
  hasImage = false,
}: WorkCardMediaProps) {
  const [loadFailed, setLoadFailed] = useState(false);

  if (!src || !hasImage || loadFailed) {
    return <Placeholder alt={alt} title={title} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={cn(
        "object-cover transition-transform duration-500 group-hover:scale-[1.035]",
        className,
      )}
      onError={() => setLoadFailed(true)}
    />
  );
}
