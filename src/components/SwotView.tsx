import React, { useState } from 'react';
import { Target, Shield, AlertOctagon, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { DecisionOption } from '../types';

interface SwotViewProps {
  options: DecisionOption[];
  recommendedOption: string;
}

export const SwotView: React.FC<SwotViewProps> = ({
  options,
  recommendedOption,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const currentOption = options[activeTab] || options[0];
  const isRecommended = currentOption.name.toLowerCase() === recommendedOption.toLowerCase();

  return (
    <div className="space-y-6">
      {/* Option Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap gap-2">
          {options.map((opt, idx) => {
            const isWinner = opt.name.toLowerCase() === recommendedOption.toLowerCase();
            const isActive = activeTab === idx;
            return (
              <button
                key={opt.name}
                onClick={() => setActiveTab(idx)}
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

        <div className="text-xs text-stone-500">
          <span className="font-bold text-stone-700">SWOT Matrix for: </span>
          <span className="text-rose-600 font-bold">{currentOption.name}</span>
        </div>
      </div>

      {/* 4 Quadrants Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/20 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-3 mb-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200 shadow-2xs">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-['Space_Grotesk'] text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Strengths (Internal)
                </h4>
                <p className="text-[10px] text-emerald-700 font-medium">Inherent advantages & proprietary leverage</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 border border-emerald-200">
              {currentOption.swot?.strengths?.length || 0}
            </span>
          </div>

          <ul className="space-y-2">
            {(currentOption.swot?.strengths || ['Inherent leverage and alignment']).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-800">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 mt-1 shadow-2xs" />
                <span className="leading-relaxed font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50 via-white to-amber-50/20 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-amber-200/70 pb-3 mb-3">
            <div className="flex items-center gap-2 text-amber-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 border border-amber-200 shadow-2xs">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-['Space_Grotesk'] text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Weaknesses (Internal)
                </h4>
                <p className="text-[10px] text-amber-700 font-medium">Vulnerabilities, resource limits & friction</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-800 border border-amber-200">
              {currentOption.swot?.weaknesses?.length || 0}
            </span>
          </div>

          <ul className="space-y-2">
            {(currentOption.swot?.weaknesses || ['Resource constraints or friction']).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-800">
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 mt-1 shadow-2xs" />
                <span className="leading-relaxed font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50 via-white to-sky-50/20 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-sky-200/70 pb-3 mb-3">
            <div className="flex items-center gap-2 text-sky-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 border border-sky-200 shadow-2xs">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-['Space_Grotesk'] text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Opportunities (External)
                </h4>
                <p className="text-[10px] text-sky-700 font-medium">Future tailwinds, expansion & upside</p>
              </div>
            </div>
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-extrabold text-sky-800 border border-sky-200">
              {currentOption.swot?.opportunities?.length || 0}
            </span>
          </div>

          <ul className="space-y-2">
            {(currentOption.swot?.opportunities || ['Favorable market or career tailwinds']).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-800">
                <span className="h-2 w-2 rounded-full bg-sky-400 shrink-0 mt-1 shadow-2xs" />
                <span className="leading-relaxed font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats */}
        <div className="rounded-3xl border border-rose-200/90 bg-gradient-to-br from-rose-50 via-white to-rose-50/20 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-rose-200/70 pb-3 mb-3">
            <div className="flex items-center gap-2 text-rose-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 border border-rose-200 shadow-2xs">
                <AlertOctagon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-['Space_Grotesk'] text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Threats (External)
                </h4>
                <p className="text-[10px] text-rose-700 font-medium">Tail risks, macro headwinds & competition</p>
              </div>
            </div>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-extrabold text-rose-800 border border-rose-200">
              {currentOption.swot?.threats?.length || 0}
            </span>
          </div>

          <ul className="space-y-2">
            {(currentOption.swot?.threats || ['External macro risks']).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-800">
                <span className="h-2 w-2 rounded-full bg-rose-400 shrink-0 mt-1 shadow-2xs" />
                <span className="leading-relaxed font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Takeaway for this option */}
      <div className="rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-xs flex items-start gap-3">
        <Target className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="text-xs text-stone-700 leading-relaxed">
          <span className="font-bold text-stone-900">Strategic Verdict for "{currentOption.name}": </span>
          {isRecommended ? (
            <span>
              This path converts internal strengths into external opportunities while maintaining acceptable threat tolerance. The risk-adjusted return strongly favors this choice.
            </span>
          ) : (
            <span>
              While viable, this path carries internal weaknesses that expose you to external threats without providing enough unique upside to break the tie.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
