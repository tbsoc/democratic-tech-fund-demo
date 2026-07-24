import { cn } from "@/lib/utils";

/**
 * DTF spark mark — a six-arm asterisk/burst. Abstract and flat-ended; it
 * fills with `currentColor`, so it takes the DTF red (or whatever `text-*`
 * the caller sets). Used both in the brand lockup and as a decorative bullet.
 */
export function AsteriskMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
    >
      <g fill="currentColor">
        <rect x="41" y="3" width="18" height="94" rx="2" />
        <rect
          x="41"
          y="3"
          width="18"
          height="94"
          rx="2"
          transform="rotate(60 50 50)"
        />
        <rect
          x="41"
          y="3"
          width="18"
          height="94"
          rx="2"
          transform="rotate(120 50 50)"
        />
      </g>
    </svg>
  );
}

/**
 * Democratic Tech Fund lockup: spark mark + wordmark. The wordmark uses the
 * legible body face (Atkinson) rather than the heavy Boldonse display face,
 * which is too wide for a three-word brand at nav sizes.
 */
export function OurCoopLogo({
  size = 22,
  className,
  wordmarkClassName,
}: {
  size?: number;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <AsteriskMark size={size} className="text-core-orange" />
      <span
        className={cn(
          "font-breadBody text-text-standard text-lg font-extrabold tracking-tight",
          wordmarkClassName,
        )}
      >
        Democratic Tech Fund
      </span>
    </span>
  );
}
