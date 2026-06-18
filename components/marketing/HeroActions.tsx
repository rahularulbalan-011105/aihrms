import Link from "next/link";
import { ArrowIcon, PlayIcon } from "./icons";

export type HeroAction = { label: string; href: string; icon?: "arrow" | "play" };

function ActionIcon({ icon }: { icon?: HeroAction["icon"] }) {
  if (icon === "arrow") return <ArrowIcon />;
  if (icon === "play") return <PlayIcon />;
  return null;
}

/** Filled gradient hero CTA link. */
export function GradientButton({ action }: { action: HeroAction }) {
  return (
    <Link
      href={action.href}
      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white text-[14px] font-semibold shadow-[0_10px_30px_-10px_rgba(109,76,255,0.55)] hover:opacity-95 transition"
      style={{ background: "var(--gradient-brand)" }}
    >
      {action.label}
      <ActionIcon icon={action.icon} />
    </Link>
  );
}

/** Outlined hero CTA link. */
export function OutlineButton({ action }: { action: HeroAction }) {
  return (
    <Link
      href={action.href}
      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-brand-300 text-brand-700 text-[14px] font-semibold hover:bg-brand-50 transition"
    >
      {action.label}
      <ActionIcon icon={action.icon} />
    </Link>
  );
}

/** Standard hero CTA pair (gradient primary + outline secondary). */
export default function HeroActions({ primary, secondary }: { primary: HeroAction; secondary: HeroAction }) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3">
      <GradientButton action={primary} />
      <OutlineButton action={secondary} />
    </div>
  );
}
