import { UserIcon, BuildingIcon } from "@/components/marketing/icons";

type Props = {
  tone: "blue" | "green";
  icon: "user" | "building";
  title: string;
  subtitle: string;
};

const COLOR: Record<Props["tone"], { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
};

/** Section header for the seekers / agencies feature columns. */
export default function ColHeader({ tone, icon, title, subtitle }: Props) {
  const c = COLOR[tone];
  return (
    <div className="flex items-start gap-3">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c.bg} ${c.text}`}>
        {icon === "user" ? <UserIcon /> : <BuildingIcon />}
      </div>
      <div>
        <h2 className={`font-display text-[26px] font-extrabold tracking-tight ${c.text}`}>
          {title}
        </h2>
        <p className="text-ink-500 text-[13px]">{subtitle}</p>
      </div>
    </div>
  );
}
