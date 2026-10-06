import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, AlertTriangle, HelpCircle, Flame, CheckCircle, RefreshCw } from 'lucide-react';
import { DecisionAnalysis, DevilsAdvocateResult } from '../types';

interface DevilsAdvocateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: DecisionAnalysis;
}

export const DevilsAdvocateDrawer: React.FC<DevilsAdvocateDrawerProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DevilsAdvocateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !data && !isLoading) {
      fetchChallenge();
    }
  }, [isOpen]);

  const fetchChallenge = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/decision/devils-advocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: analysis.title,
          recommendedOption: analysis.recommendedOption,
          context: analysis.summary,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to generate interrogation.');
      setData(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error running stress test.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-rose-200/90 bg-white p-6 sm:p-8 shadow-2xl shadow-rose-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-rose-600 mb-1">
          <ShieldAlert className="h-5 w-5" />
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-stone-900 uppercase tracking-wider">
            Devil's Advocate Stress-Test
          </h3>
        </div>
        <p className="text-xs text-stone-500 mb-5">
          A caring yet candid interrogation to expose blindspots and strengthen your conviction in <span className="text-rose-700 font-bold">"{analysis.recommendedOption}"</span>.
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-stone-500 gap-3">
            <RefreshCw className="h-7 w-7 animate-spin text-rose-500" />
            <span className="text-xs font-semibold">Crafting piercing questions...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
            {error}
            <button
              onClick={fetchChallenge}
              className="mt-2 block font-bold underline"
            >
              Retry
            </button>
          </div>
        ) : data ? (
          <div className="space-y-4">
            {/* Harsh Truth */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 mb-1.5">
                <Flame className="h-4 w-4" />
                <span>The Uncomfortable Reality</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-850 leading-relaxed font-semibold">
                {data.harshTruth}
              </p>
            </div>

            {/* 3 Tough Questions */}
            <div className="rounded-2xl border border-stone-200 bg-[#FCFAF7] p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <span>3 Self-Honesty Questions</span>
              </div>
              <div className="space-y-2.5">
                {data.threeToughQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-800">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-extrabold text-rose-700 border border-rose-200">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Costs */}
            <div className="rounded-2xl border border-stone-200 bg-[#FCFAF7] p-5 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Unseen Energy & Emotional Taxes
              </div>
              <ul className="space-y-1.5">
                {data.hiddenCosts.map((cost, idx) => (
                  <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="font-medium">{cost}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Worst Case Defense */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>How to Validate You're Ready</span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {data.verdictValidation}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
