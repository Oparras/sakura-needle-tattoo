import { cn } from "@/lib/utils";

type PetalClusterProps = {
  className?: string;
};

const petals = [
  { left: "8%", top: "18%", rotate: "-22deg", scale: 1 },
  { left: "30%", top: "0%", rotate: "12deg", scale: 0.82 },
  { left: "48%", top: "26%", rotate: "34deg", scale: 1.08 },
  { left: "64%", top: "8%", rotate: "-10deg", scale: 0.72 },
  { left: "74%", top: "38%", rotate: "20deg", scale: 0.94 },
];

export function PetalCluster({ className }: PetalClusterProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute size-44 opacity-80 sm:size-56",
        className,
      )}
    >
      {petals.map((petal, index) => (
        <span
          key={`${petal.left}-${petal.top}-${index}`}
          className="absolute h-14 w-9 rounded-full border border-sakura/70 bg-white/70 shadow-[0_8px_20px_rgba(171,128,136,0.08)] sm:h-16 sm:w-10"
          style={{
            left: petal.left,
            top: petal.top,
            transform: `rotate(${petal.rotate}) scale(${petal.scale})`,
          }}
        />
      ))}
    </div>
  );
}
