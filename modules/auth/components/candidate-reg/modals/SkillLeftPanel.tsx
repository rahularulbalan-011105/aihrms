"use client";

import { useState, useEffect } from "react";
import { fetchSkills } from "../../../services/candidate.service";
import type { Skill } from "../../../types/auth.types";
import { POPULAR_SKILLS, POPULAR_SKILL_COLORS, PROFICIENCY_LEVELS, SKILL_PALETTE } from "../shared/constants";
import { DotsIndicator } from "../shared/ui";
import { SearchIcon, TrashSmIcon, SpinnerIcon } from "../shared/icons";

function colorForIndex(index: number): string {
  return SKILL_PALETTE[index % SKILL_PALETTE.length];
}

function getAddedSkillColor(name: string): string {
  return POPULAR_SKILL_COLORS[name] ?? "#6366f1";
}

interface PopularEntry { name: string; color: string; }

interface SearchResult { id: string; name: string; category: string; }

interface Props {
  selectedName: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchResults: SearchResult[];
  onSelect: (name: string, color: string) => void;
  addedSkills: Skill[];
  onDeleteRequest: (id: string, name: string) => void;
  nameError?: string;
}

export default function SkillLeftPanel({
  selectedName, searchQuery, onSearchChange, searchResults,
  onSelect, addedSkills, onDeleteRequest, nameError,
}: Props) {
  const [allPopular,     setAllPopular]     = useState<PopularEntry[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [showMore,       setShowMore]       = useState(false);

  useEffect(() => {
    fetchSkills()
      .then(items => {
        if (items.length > 0) {
          setAllPopular(items.map((item, i) => ({ name: item.name, color: colorForIndex(i) })));
        } else {
          // Fallback to hardcoded list if DB returns nothing
          setAllPopular(POPULAR_SKILLS);
        }
      })
      .catch(() => setAllPopular(POPULAR_SKILLS))
      .finally(() => setPopularLoading(false));
  }, []);

  const visiblePopular = showMore ? allPopular : allPopular.slice(0, 9);

  return (
    <div className="w-[330px] shrink-0 border-r border-ink-100 overflow-y-auto p-5 space-y-4
      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-brand-600 text-white text-[12px] font-bold flex items-center justify-center shrink-0">1</div>
        <span className="font-display font-bold text-[14px] text-ink-900">Search or Select Skill</span>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"><SearchIcon /></span>
        <input value={searchQuery} onChange={e => onSearchChange(e.target.value)}
          placeholder="Search skills (e.g., Java, Python, AWS...)"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 text-[12.5px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
        {searchResults.length > 0 && (
          <ul className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl border border-ink-200 shadow-lg max-h-44 overflow-y-auto">
            {searchResults.map(s => (
              <li key={s.id}>
                <button type="button" onMouseDown={() => onSelect(s.name, "#6366f1")}
                  className="w-full text-left px-3 py-2 text-[13px] text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition">
                  {s.name}
                  {s.category && <span className="text-[11px] text-ink-400 ml-2">{s.category}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {nameError && <p className="text-[12px] text-red-600 -mt-2">{nameError}</p>}

      {/* Popular Skills grid */}
      <div>
        <div className="text-[11.5px] font-semibold text-ink-500 uppercase tracking-wide mb-2">Popular Skills</div>

        {popularLoading ? (
          <div className="flex items-center justify-center py-4 text-ink-400">
            <SpinnerIcon />
            <span className="ml-2 text-[12px]">Loading skills…</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1.5">
              {visiblePopular.map(skill => (
                <button key={skill.name} type="button" onClick={() => onSelect(skill.name, skill.color)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg border text-[11.5px] font-medium transition ${
                    selectedName === skill.name
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50"
                  }`}>
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: skill.color }} />
                    <span className="truncate">{skill.name}</span>
                  </span>
                  <span className="text-brand-500 font-bold text-[13px] ml-1 shrink-0">+</span>
                </button>
              ))}
            </div>
            {allPopular.length > 9 && (
              <button type="button" onClick={() => setShowMore(s => !s)}
                className="flex items-center gap-1 text-[12px] font-semibold text-brand-600 hover:text-brand-700 transition mt-2">
                {showMore ? "View Less ▲" : `View More (${allPopular.length - 9} more) ▼`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Added Skills list */}
      {addedSkills.length > 0 && (
        <div>
          <div className="text-[11.5px] font-semibold text-ink-500 uppercase tracking-wide mb-2">
            Your Added Skills ({addedSkills.length})
          </div>
          <div className="space-y-1.5">
            {addedSkills.map(s => {
              const dotsFilled = PROFICIENCY_LEVELS.find(p => p.label === s.proficiency)?.dots ?? 0;
              return (
                <div key={s.id} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-ink-100 bg-ink-50/30">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getAddedSkillColor(s.name) }} />
                  <span className="flex-1 text-[12px] font-medium text-ink-800 truncate">{s.name}</span>
                  <DotsIndicator filled={dotsFilled} size={7} />
                  <span className="text-[10px] text-ink-500 w-[68px] shrink-0">{s.proficiency}</span>
                  {s.highlighted && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] font-semibold whitespace-nowrap">
                      ⭐ Top
                    </span>
                  )}
                  <button type="button" onClick={() => onDeleteRequest(s.id, s.name)}
                    className="text-ink-300 hover:text-red-500 transition shrink-0 ml-0.5">
                    <TrashSmIcon />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
