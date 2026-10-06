import React from 'react';
import { Compass, Clock, Heart, Skull, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { TiebreakerFrameworks, DecisionOption } from '../types';
import { CoinFlipSimulator } from './CoinFlipSimulator';

interface PsychologicalFrameworksViewProps {
  frameworks: TiebreakerFrameworks;
  options: DecisionOption[];
  recommendedOption: string;
}

export const PsychologicalFrameworksView: React.FC<PsychologicalFrameworksViewProps> = ({
  frameworks,
  options,
  recommendedOption,
}) => {
  return (
    <div className="space-y-8">
      {/* Framework 1: 10/10/10 Rule */}
      <div className="rounded-3xl border border-stone-200 bg-white/80 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-rose-600">
          <Clock className="h-5 w-5" />
          <h3 className="font-['Space_Grotesk'] text-base font-bold text-stone-900 uppercase tracking-wider">
            The 10/10/10 Perspective Rule
          </h3>
        </div>
        <p className="text-xs text-stone-600 mb-5">
          Developed by Suzy Welch: How will you feel about committing to <span className="text-rose-700 font-bold">"{recommendedOption}"</span> across distinct time horizons?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-4.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">In 10 Minutes</span>
              <span className="text-[10px] text-stone-500 font-semibold">Immediate</span>
            </div>
            <p className="text-xs text-stone-800 leading-relaxed font-medium">
              {frameworks.tenTenTenRule?.in10Minutes || 'Brief spike of adrenaline followed by the relief of ending ambiguity.'}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-4.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">In 10 Months</span>
              <span className="text-[10px] text-stone-500 font-semibold">Medium-term</span>
            </div>
            <p className="text-xs text-stone-800 leading-relaxed font-medium">
              {frameworks.tenTenTenRule?.in10Months || 'The initial turbulence is absorbed into your routine; tangible progress is visible.'}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-4.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">In 10 Years</span>
              <span className="text-[10px] text-stone-500 font-semibold">Long-term legacy</span>
            </div>
            <p className="text-xs text-stone-800 leading-relaxed font-medium">
              {frameworks.tenTenTenRule?.in10Years || 'A proud inflection point that opened doors rather than wondering "what if".'}
            </p>
          </div>
        </div>
      </div>

      {/* Framework 2: Regret Minimization Framework */}
      <div className="rounded-3xl border border-rose-200/80 bg-rose-50/40 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-rose-600">
          <Heart className="h-5 w-5" />
          <h3 className="font-['Space_Grotesk'] text-base font-bold text-stone-900 uppercase tracking-wider">
            Regret Minimization Test (The 80-Year-Old Perspective)
          </h3>
        </div>
        <p className="text-xs text-stone-600 mb-4">
          Jeff Bezos famously built Amazon using this framework: projecting yourself forward to age 80 and asking which choice will produce fewer haunting regrets.
        </p>

        <div className="rounded-2xl border border-rose-200/80 bg-white p-5 space-y-3.5 shadow-2xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              The Long-Range Regret Calculus:
            </span>
            <p className="text-xs sm:text-sm text-stone-800 mt-1 leading-relaxed font-medium">
              {frameworks.regretMinimization?.analysis}
            </p>
          </div>

          <div className="border-t border-rose-100 pt-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Action vs Omission:
            </span>
            <p className="text-xs text-stone-700 mt-1 italic">
              {frameworks.regretMinimization?.whichRegretIsHeavier}
            </p>
          </div>
        </div>
      </div>

      {/* Framework 3: Gary Klein's Pre-Mortem Forensics */}
      <div className="rounded-3xl border border-purple-200/80 bg-purple-50/30 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-purple-700">
          <Skull className="h-5 w-5" />
          <h3 className="font-['Space_Grotesk'] text-base font-bold text-stone-900 uppercase tracking-wider">
            Pre-Mortem Failure Analysis
          </h3>
        </div>
        <p className="text-xs text-stone-600 mb-4">
          Assume it's 12 months in the future and your choice crashed and burned. What caused it, and what safeguard protects you today?
        </p>

        <div className="space-y-3">
          {(frameworks.preMortem || []).map((pm, idx) => (
            <div key={idx} className="rounded-2xl border border-purple-100 bg-white p-4.5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-stone-900">
                  {pm.option}
                </span>
                <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Vulnerability
                </span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="text-xs text-stone-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-700">Failure Scenario: </span>
                    <span>{pm.failureScenario}</span>
                  </div>
                </div>

                <div className="text-xs text-stone-800 flex items-start gap-2 border-t border-stone-100 pt-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-700">Safeguard Rule: </span>
                    <span>{pm.preventionTip}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Framework 4: Coin Flip Simulator */}
      <CoinFlipSimulator options={options.map((o) => o.name)} />
    </div>
  );
};
