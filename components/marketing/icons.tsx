import type { ReactElement } from "react";

/**
 * Shared marketing icon set.
 *
 * Every icon takes an optional `size` (px, applied to width + height) and uses
 * `currentColor` so the parent controls the colour via Tailwind text-* classes.
 * Import these instead of re-inlining SVG paths inside pages.
 */
type IconProps = { size?: number };

export function ArrowIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 13 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M13 8H3m0 0l5-5m-5 5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 5.5l4 2.5-4 2.5v-5z" fill="currentColor" />
    </svg>
  );
}

export function MailIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function CheckIcon({ size = 11 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function BrainIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 4c-2.2 0-4 1.8-4 4v.5C4 9.7 3 11 3 12.5S4 15 5 15.5V16c0 2.2 1.8 4 4 4 1 0 2-.4 2.7-1H12c.7.6 1.7 1 2.7 1 2.2 0 4-1.8 4-4v-.5c1-.4 2-1.7 2-3s-1-2.6-2-3V8c0-2.2-1.8-4-4-4-1 0-2 .4-2.7 1H12c-.7-.6-1.7-1-2.7-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function TargetIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function BoltIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

export function DocIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 2v5h5M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function UsersIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ChartIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6" />
      <rect x="7" y="13" width="3" height="5" fill="currentColor" />
      <rect x="12" y="9" width="3" height="9" fill="currentColor" />
      <rect x="17" y="6" width="3" height="12" fill="currentColor" />
    </svg>
  );
}

export function TrendIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 17l6-6 4 4 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function UploadCloudIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.7-1A4 4 0 0 0 7 18z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 12v6M9 15l3-3 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Single-person stat glyph (used in stats strips). */
export function PersonStatIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c1-4 4-6 7-6s6 2 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BuildingIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 9h2M13 9h2M9 13h2M13 13h2M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function DuplicateIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="3" width="13" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="7" width="13" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" fill="white" />
    </svg>
  );
}

export function RobotIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="7" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      <circle cx="15" cy="13" r="1.5" fill="currentColor" />
      <path d="M12 4v3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function BellIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2zM10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function PlaneIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function MatchIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 6a3 3 0 0 1 6 0v12a3 3 0 0 1-6 0M3 12h6M15 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AnalyticsIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 4v16h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 17l4-5 3 3 5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TeamIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3 3.5-3 2 0 3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function FakeProfileIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TrophyIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M10 14h4M9 20h6M12 14v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AlertIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l9 16H3l9-16z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function WrenchIcon({ size = 13 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.8-.7-.7-2.8 2.5-2.5z" />
    </svg>
  );
}

/**
 * Name → icon registry. Lets data-driven cards select an icon by string key.
 * Falls back to a bullet for unknown keys.
 */
export const ICONS: Record<string, (props: IconProps) => ReactElement> = {
  arrow: ArrowIcon,
  arrowLeft: ArrowLeftIcon,
  play: PlayIcon,
  mail: MailIcon,
  check: CheckIcon,
  checkCircle: CheckCircleIcon,
  shield: ShieldIcon,
  brain: BrainIcon,
  target: TargetIcon,
  bolt: BoltIcon,
  doc: DocIcon,
  parse: DocIcon,
  users: UsersIcon,
  chart: ChartIcon,
  track: ChartIcon,
  trend: TrendIcon,
  search: SearchIcon,
  upload: UploadCloudIcon,
  personStat: PersonStatIcon,
  user: UserIcon,
  building: BuildingIcon,
  duplicate: DuplicateIcon,
  robot: RobotIcon,
  bell: BellIcon,
  plane: PlaneIcon,
  apply: PlaneIcon,
  star: StarIcon,
  match: MatchIcon,
  analytics: AnalyticsIcon,
  team: TeamIcon,
  fakeprofile: FakeProfileIcon,
  alert: AlertIcon,
  trophy: TrophyIcon,
  screen: CheckCircleIcon,
  wrench: WrenchIcon,
};

/** Render an icon by registry key. */
export function Glyph({ name, size }: { name: string; size?: number }) {
  const Cmp = ICONS[name];
  return Cmp ? <Cmp size={size} /> : <span>•</span>;
}
