import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, ShieldCheck, Tag, Plus, Check, X, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { DecisionOption, ProItem, ConItem } from '../types';

interface ProsConsViewProps {
  options: DecisionOption[];
  recommendedOption: string;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  options: initialOptions,
  recommendedOption,
}) => {
  // Local state to allow user to tweak weights, add custom pros/cons, or toggle items
  const [options, setOptions] = useState<DecisionOption[]>(initialOptions);
  const [activeOptionTab, setActiveOptionTab] = useState<number>(0);
  const [customItemType, setCustomItemType] = useState<'pro' | 'con'>('pro');
  const [customText, setCustomText] = useState('');
  const [customImpact, setCustomImpact] = useState<'critical' | 'high' | 'medium'>('high');
  const [customMitigation, setCustomMitigation] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const currentOption = options[activeOptionTab] || options[0];

  const handleAdjustProWeight = (optIdx: number, proIdx: number, delta: number) => {
    const updated = [...options];
    const item = updated[optIdx].pros[proIdx];
    const newWeight = Math.min(5, Math.max(1, item.scoreWeight + delta));
    item.scoreWeight = newWeight;
    setOptions(updated);
  };

  const handleAdjustConWeight = (optIdx: number, conIdx: number, delta: number) => {
    const updated = [...options];
    const item = updated[optIdx].cons[conIdx];
    const newWeight = Math.min(5, Math.max(1, item.scoreWeight + delta));
    item.scoreWeight = newWeight;
    setOptions(updated);
  };

  const handleRemovePro = (optIdx: number, proIdx: number) => {
    const updated = [...options];
    updated[optIdx].pros.splice(proIdx, 1);
    setOptions(updated);
  };

  const handleRemoveCon = (optIdx: number, conIdx: number) => {
    const updated = [...options];
    updated[optIdx].cons.splice(conIdx, 1);
    setOptions(updated);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const updated = [...options];
    if (customItemType === 'pro') {
      updated[activeOptionTab].pros.push({
        text: customText.trim(),
        impact: customImpact,
        category: 'strategic',
        scoreWeight: customImpact === 'critical' ? 5 : customImpact === 'high' ? 4 : 3,
      });
    } else {
      updated[activeOptionTab].cons.push({
        text: customText.trim(),
        severity: customImpact,
        category: 'strategic',
        mitigation: customMitigation.trim() || undefined,
        scoreWeight: customImpact === 'critical' ? 5 : customImpact === 'high' ? 4 : 3,
      });
    }

    setOptions(updated);
    setCustomText('');
    setCustomMitigation('');
    setIsAddingItem(false);
  };

  // Calculate net pro vs con scores
  const totalProScore = currentOption.pros.reduce((acc, p) => acc + (p.scoreWeight || 3), 0);
  const totalConScore = currentOption.cons.reduce((acc, c) => acc + (c.scoreWeight || 3), 0);
  const netScore = totalProScore - totalConScore;

  const categoryColorMap: Record<string, string> = {
    financial: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
    growth: 'bg-indigo-100/90 text-indigo-800 border-indigo-200',
    lifestyle: 'bg-amber-100/90 text-amber-800 border-amber-200',
    emotional: 'bg-rose-100/90 text-rose-800 border-rose-200',
    strategic: 'bg-sky-100/90 text-sky-800 border-sky-200',
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap gap-2">
          {options.map((opt, idx) => {
            const isWinner = opt.name.toLowerCase() === recommendedOption.toLowerCase();
            const isActive = activeOptionTab === idx;
            return (
              <button
                key={opt.name}
                onClick={() => {
                  setActiveOptionTab(idx);
                  setIsAddingItem(false);
                }}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 shadow-xs'
                    : 'border border-stone-200 bg-white/90 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span>{opt.name}</span>
                {isWinner && (
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                    isActive ? 'bg-rose-200 text-rose-800' : 'bg-rose-100 text-rose-700'
                  }`}>
                    Winner
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Persona Fit Badge */}
        <div className="text-xs text-stone-500">
          <span className="font-bold text-stone-700">Profile Fit: </span>
          <span className="italic">{currentOption.bestForPersona}</span>
        </div>
      </div>

      {/* Net Balance Calculus Bar */}
      <div className="rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Net Weighted Balance for "{currentOption.name}"
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-700 font-bold">Pros Weight: +{totalProScore}</span>
            <span className="text-rose-700 font-bold">Cons Weight: -{totalConScore}</span>
            <span className={`font-extrabold px-2.5 py-0.5 rounded-full ${
              netScore > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}>
              Net: {netScore > 0 ? `+${netScore}` : netScore}
            </span>
          </div>
        </div>

        {/* Progress balance bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100 flex">
          <div
            className="bg-emerald-300 transition-all duration-300"
            style={{ width: `${(totalProScore / (totalProScore + totalConScore || 1)) * 100}%` }}
          />
          <div
            className="bg-rose-300 transition-all duration-300"
            style={{ width: `${(totalConScore / (totalProScore + totalConScore || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Pros & Cons Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pros Column */}
        <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/40 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-3 mb-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200 shadow-2xs">
                <ThumbsUp className="h-4 w-4" />
              </div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-stone-900">
                Advantages & Upsides ({currentOption.pros.length})
              </h3>
            </div>
            <button
              onClick={() => {
                setCustomItemType('pro');
                setIsAddingItem(true);
              }}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <Plus className="h-3 w-3" /> Add Pro
            </button>
          </div>

          <div className="space-y-3">
            {currentOption.pros.map((pro, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-emerald-100/90 bg-white p-4 transition-all hover:border-emerald-300 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold text-stone-850 leading-snug">
                      {pro.text}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        categoryColorMap[pro.category] || 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {pro.category}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg ${
                        pro.impact === 'critical'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : pro.impact === 'high'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {pro.impact} impact
                      </span>
                    </div>
                  </div>

                  {/* Weight modifier */}
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => handleAdjustProWeight(activeOptionTab, idx, 1)}
                      className="text-stone-400 hover:text-emerald-600 p-0.5 transition-colors"
                      title="Increase importance weight"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-extrabold text-emerald-700">
                      +{pro.scoreWeight || 3}
                    </span>
                    <button
                      onClick={() => handleAdjustProWeight(activeOptionTab, idx, -1)}
                      className="text-stone-400 hover:text-stone-600 p-0.5 transition-colors"
                      title="Decrease importance weight"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Dismiss item button */}
                <button
                  onClick={() => handleRemovePro(activeOptionTab, idx)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 transition-opacity"
                  title="Remove this point"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cons Column */}
        <div className="rounded-3xl border border-rose-200/80 bg-rose-50/40 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-rose-200/70 pb-3 mb-4">
            <div className="flex items-center gap-2 text-rose-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 border border-rose-200 shadow-2xs">
                <ThumbsDown className="h-4 w-4" />
              </div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-stone-900">
                Disadvantages & Risks ({currentOption.cons.length})
              </h3>
            </div>
            <button
              onClick={() => {
                setCustomItemType('con');
                setIsAddingItem(true);
              }}
              className="flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-800 transition-colors"
            >
              <Plus className="h-3 w-3" /> Add Con
            </button>
          </div>

          <div className="space-y-3">
            {currentOption.cons.map((con, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-rose-100/90 bg-white p-4 transition-all hover:border-rose-300 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold text-stone-850 leading-snug">
                      {con.text}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        categoryColorMap[con.category] || 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {con.category}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg ${
                        con.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : con.severity === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {con.severity} severity
                      </span>
                    </div>

                    {/* Actionable Mitigation Tip */}
                    {con.mitigation && (
                      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-stone-800 flex items-start gap-2 shadow-2xs">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-900">Mitigation Tactic: </span>
                          <span>{con.mitigation}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Weight modifier */}
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => handleAdjustConWeight(activeOptionTab, idx, 1)}
                      className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors"
                      title="Increase severity weight"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-extrabold text-rose-700">
                      -{con.scoreWeight || 3}
                    </span>
                    <button
                      onClick={() => handleAdjustConWeight(activeOptionTab, idx, -1)}
                      className="text-stone-400 hover:text-stone-600 p-0.5 transition-colors"
                      title="Decrease severity weight"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Dismiss item button */}
                <button
                  onClick={() => handleRemoveCon(activeOptionTab, idx)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 transition-opacity"
                  title="Remove this point"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Custom Point Modal / Form */}
      {isAddingItem && (
        <form onSubmit={handleAddCustomItem} className="rounded-3xl border border-rose-200 bg-white p-5 sm:p-6 shadow-lg shadow-rose-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Add Custom {customItemType === 'pro' ? 'Pro' : 'Con'} to "{currentOption.name}"
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={`Describe this ${customItemType}...`}
                className="w-full rounded-2xl border border-stone-200 bg-[#FCFAF7] px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                autoFocus
              />
            </div>

            {customItemType === 'con' && (
              <div>
                <input
                  type="text"
                  value={customMitigation}
                  onChange={(e) => setCustomMitigation(e.target.value)}
                  placeholder="Optional: How could you mitigate or safeguard against this con?"
                  className="w-full rounded-2xl border border-stone-200 bg-[#FCFAF7] px-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-stone-500">Impact:</span>
                {(['medium', 'high', 'critical'] as const).map((imp) => (
                  <button
                    key={imp}
                    type="button"
                    onClick={() => setCustomImpact(imp)}
                    className={`rounded-xl px-3 py-1 text-[10px] font-bold uppercase transition-all ${
                      customImpact === imp
                        ? 'bg-rose-200 text-rose-800 border border-rose-300'
                        : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {imp}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-rose-400 to-amber-300 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:from-rose-500 hover:to-amber-400"
                >
                  Save Point
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
