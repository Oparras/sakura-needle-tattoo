import { cn } from "@/lib/utils";

type SakuraBranchProps = {
  className?: string;
  mirrored?: boolean;
};

function SakuraBlossom({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[
        "0 0",
        "72 0",
        "144 0",
        "36 72",
        "108 72",
      ].map((origin, index) => (
        <ellipse
          key={`${origin}-${index}`}
          cx="0"
          cy="-7.5"
          rx="7"
          ry="13"
          transform={`rotate(${index * 72})`}
          fill="rgba(244,199,205,0.42)"
          stroke="rgba(197,146,156,0.52)"
          strokeWidth="1.2"
        />
      ))}
      <circle r="3.2" fill="rgba(108,86,92,0.52)" />
    </g>
  );
}

export function SakuraBranch({
  className,
  mirrored = false,
}: SakuraBranchProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 150"
      className={cn(
        "pointer-events-none absolute h-auto w-44 opacity-75 sm:w-52",
        mirrored && "-scale-x-100",
        className,
      )}
    >
      <path
        d="M16 128C52 110 78 92 97 70c17-20 33-46 50-54 14-7 30-5 42 5"
        fill="none"
        stroke="rgba(136,103,110,0.42)"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M79 89c-10-9-22-13-34-13"
        fill="none"
        stroke="rgba(136,103,110,0.32)"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <path
        d="M112 57c4-12 8-24 20-33"
        fill="none"
        stroke="rgba(136,103,110,0.32)"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <path
        d="M149 44c12-6 23-6 34-3"
        fill="none"
        stroke="rgba(136,103,110,0.32)"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <SakuraBlossom x={72} y={90} scale={0.72} />
      <SakuraBlossom x={116} y={56} scale={0.82} />
      <SakuraBlossom x={158} y={40} scale={0.9} />
      <circle cx="47" cy="74" r="5.5" fill="rgba(244,199,205,0.32)" />
      <circle cx="134" cy="24" r="4.5" fill="rgba(244,199,205,0.28)" />
    </svg>
  );
}
