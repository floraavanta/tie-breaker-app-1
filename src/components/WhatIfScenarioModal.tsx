import React, { useState } from 'react';
import { X, Sparkles, Send, ArrowRight, RefreshCw, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { DecisionAnalysis, WhatIfResult } from '../types';

interface WhatIfScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: DecisionAnalysis;
}

export const WhatIfScenarioModal: React.FC<WhatIfScenarioModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const [whatIfInput, setWhatIfInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickIdeas = [
    'What if they offer 20% more compensation or budget?',
    'What if I have an option to reverse this decision in 6 months?',
    'What if I can negotiate fully remote / flexible terms?',
    'What if my main risk actually occurs in month 3?',
  ];

  const handleRunWhatIf = async (queryText?: string) => {
    const textToRun = queryText || whatIfInput;
    if (!textToRun.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/decision/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalAnalysis: analysis,
          whatIfPrompt: textToRun.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to simulate what-if scenario.');

      setResult(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error running what-if scenario.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-sky-200/90 bg-white p-6 sm:p-8 shadow-2xl shadow-sky-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-sky-600 mb-1">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-stone-900 uppercase tracking-wider">
            Test a "What-If?" Scenario
          </h3>
        </div>
        <p className="text-xs text-stone-500 mb-5">
          Simulate how a new constraint, unexpected offer, counter-proposal, or condition shifts the decision balance.
        </p>

        {/* Input Form */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={whatIfInput}
              onChange={(e) => setWhatIfInput(e.target.value)}
              placeholder="e.g., What if the startup guarantees a minimum 12-month severance?"
              className="flex-1 rounded-2xl border border-stone-200 bg-[#FCFAF7] px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunWhatIf();
              }}
            />
            <button
              onClick={() => handleRunWhatIf()}
              disabled={isLoading || !whatIfInput.trim()}
              className="flex items-center gap-1.5 rounded-2xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-sky-600 transition-all disabled:opacity-50 shadow-xs"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Simulate</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Idea Prompts */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-stone-500 flex items-center gap-1 mr-1">
              <Lightbulb className="h-3 w-3 text-sky-500" /> Quick test:
            </span>
            {quickIdeas.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setWhatIfInput(idea);
                  handleRunWhatIf(idea);
                }}
                className="rounded-xl border border-stone-200 bg-stone-50/80 px-2.5 py-1 text-[11px] text-stone-600 hover:border-sky-300 hover:bg-sky-50/80 hover:text-stone-900 transition-all"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Results display */}
        {result && (
          <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Updated Recommendation
                </span>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-sky-800">
                  {result.updatedRecommendation}
                </h4>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                result.verdictChanged
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {result.verdictChanged ? '⚠️ Verdict Flipped' : '✓ Verdict Unchanged'}
              </span>
            </div>

            <div className="text-xs text-stone-700 leading-relaxed">
              <p className="font-bold text-stone-900 mb-1">Impact Analysis:</p>
              <p>{result.shiftAnalysis}</p>
            </div>

            {result.adjustedProsCons && result.adjustedProsCons.length > 0 && (
              <div className="space-y-1.5 border-t border-sky-100 pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Calculus Adjustments
                </span>
                {result.adjustedProsCons.map((item, idx) => (
                  <div key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>
                      <strong className="text-stone-900">[{item.option}]: </strong>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {result.negotiationOrTacticalLeverage && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-stone-800">
                <span className="font-bold text-amber-800">Tactical Leverage Point: </span>
                {result.negotiationOrTacticalLeverage}
              </div>
            )}

            <div className="text-xs italic text-stone-500 border-t border-sky-100 pt-2">
              "{result.bottomLineAdvice}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
