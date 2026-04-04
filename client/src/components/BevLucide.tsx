/**
 * Shared Lucide icon styling for Beverly's "Craftsman's Gold" pages.
 * Keeps list bullets and success states consistent (no emoji / dingbats).
 */
import { Check } from "lucide-react";

const gold = "#C9A84C";

/** Small checkmark for credential lists, blog bullets, and feature lines */
export function BevListCheck({
  className,
  size = 14,
  marginTop = "4px",
}: {
  className?: string;
  size?: number;
  marginTop?: string;
}) {
  return (
    <Check
      size={size}
      strokeWidth={2}
      color={gold}
      className={className}
      style={{ marginTop, flexShrink: 0 }}
      aria-hidden
    />
  );
}

/** Feature row bullet (wig tiers, etc.) — pass color for dark-on-gold cards */
export function BevFeatureCheck({ featured }: { featured?: boolean }) {
  return (
    <Check
      size={14}
      strokeWidth={2}
      color={featured ? "#111" : gold}
      style={{ flexShrink: 0 }}
      aria-hidden
    />
  );
}
