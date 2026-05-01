import { cn } from "@/lib/utils";

type SakuraDividerProps = {
  className?: string;
};

export function SakuraDivider({ className }: SakuraDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none mx-auto flex w-full max-w-[15rem] items-center gap-3 opacity-80 sm:max-w-[18rem]",
        className,
      )}
    >
      <span className="h-px flex-1 bg-soft-border" />
      <svg viewBox="0 0 64 24" className="h-6 w-16 text-sakura-strong/80">
        <path
          d="M2 12h18m24 0h18"
          fill="none"
          stroke="rgba(182,140,149,0.55)"
          strokeLinecap="round"
          strokeWidth="1.4"
        />
        <g transform="translate(32 12)">
          {[0, 72, 144, 216, 288].map((rotation) => (
            <ellipse
              key={rotation}
              cx="0"
              cy="-4.6"
              rx="4"
              ry="7"
              transform={`rotate(${rotation})`}
              fill="rgba(244,199,205,0.46)"
              stroke="rgba(197,146,156,0.5)"
              strokeWidth="0.8"
            />
          ))}
          <circle r="1.9" fill="rgba(108,86,92,0.48)" />
        </g>
      </svg>
      <span className="h-px flex-1 bg-soft-border" />
    </div>
  );
}
