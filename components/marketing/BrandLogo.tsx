/**
 * Official HireMind logo.
 *
 * The PNG (public/logo.png) contains the magnifying-glass icon + "HireMind"
 * wordmark stacked vertically (1490 × 1021 content, aspect ≈ 1.46 : 1).
 *
 * Display sizes:
 *   size="lg"  → 68 px tall (marketing header — icon ~42px + text ~26px)
 *   size="md"  → 56 px tall (auth / registration headers)
 *   size="sm"  → 44 px tall (compact headers)
 *
 * Or pass an explicit `height` number for full control.
 */
interface Props {
  size?: "lg" | "md" | "sm";
  height?: number;
  className?: string;
}

const SIZE_MAP = { lg: 68, md: 56, sm: 44 } as const;
const ASPECT   = 1.46; // width / height of the logo content

export default function BrandLogo({ size = "lg", height, className = "" }: Props) {
  const h = height ?? SIZE_MAP[size];
  const w = Math.round(h * ASPECT);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="HireMind"
      height={h}
      width={w}
      className={className}
      style={{ height: `${h}px`, width: `${w}px`, objectFit: "contain", display: "block" }}
    />
  );
}
