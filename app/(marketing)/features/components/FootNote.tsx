import { ShieldIcon, CheckIcon } from "@/components/marketing/icons";

type Props = {
  tone: "blue" | "green";
  icon: "shield" | "check";
  children: React.ReactNode;
};

/** Tinted footer strip at the bottom of each feature column. */
export default function FootNote({ tone, icon, children }: Props) {
  const cls =
    tone === "blue"
      ? "bg-blue-100/70 text-blue-700"
      : "bg-green-100/70 text-green-700";
  return (
    <div className={`mt-5 px-4 py-3 rounded-lg text-[13px] font-semibold flex items-center gap-2 ${cls}`}>
      {icon === "shield" ? <ShieldIcon /> : <CheckIcon />}
      {children}
    </div>
  );
}
