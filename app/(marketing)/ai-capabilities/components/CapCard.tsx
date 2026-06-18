import { Glyph } from "@/components/marketing/icons";
import { ICON_TONE, type Capability } from "../capabilities.data";
import { BLOCKS } from "./blocks";

/** A single AI-capability card: icon header, copy, and a demo preview block. */
export default function CapCard({ capability }: { capability: Capability }) {
  const Block = BLOCKS[capability.block];
  return (
    <div className="card p-4 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div
          className={`w-9 h-9 rounded-md flex items-center justify-center ${ICON_TONE[capability.tone]}`}
        >
          <Glyph name={capability.icon} />
        </div>
        <span className="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
          AI
        </span>
      </div>
      <div className="mt-3 font-display font-bold text-[14px] leading-tight">
        {capability.title}
      </div>
      <p className="mt-1.5 text-ink-500 text-[11.5px] leading-relaxed">
        {capability.body}
      </p>
      {Block && (
        <div className="mt-4 rounded-md bg-ink-100/40 p-3 border border-ink-100">
          <Block />
        </div>
      )}
    </div>
  );
}
