import React from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, CheckCircle2, AlertTriangle, ArrowRight, Copy, Check, MessageSquarePlus, ShieldAlert, Sparkles } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface TiebreakerVerdictCardProps {
  analysis: DecisionAnalysis;
  onOpenWhatIf: () => void;
  onOpenDevilsAdvocate: () => void;
}

export const TiebreakerVerdictCard: React.FC<TiebreakerVerdictCardProps> = ({
  analysis,
  onOpenWhatIf,
  onOpenDevilsAdvocate,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleFireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#f97316', '#38bdf8', '#10b981'],
    });
  };

  const handleCopySummary = () => {
    const text = `🎯 THE TIEBREAKER VERDICT: ${analysis.recommendedOption}
Decision: ${analysis.title}
Confidence: ${analysis.confidenceScore}%

Key Takeaway: "${analysis.keyTakeaway}"

Rationale:
${analysis.confidenceRationale}

Action Plan:
${analysis.actionPlan.map((s) => `${s.step}. [${s.timeframe}] ${s.action}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-rose-200/90 bg-gradient-to-b from-white via-[#FFFDF9] to-[#FFF9F5] p-6 sm:p-9 shadow-xl shadow-rose-100/60">
      {/* Background soft pastel ambient lighting */}
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-rose-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 shadow-xs">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              The Arbitrator's Final Verdict
            </span>
            <h2 className="text-xs sm:text-sm text-stone-500 font-medium">
              Based on your values, trade-offs & risk tolerance
            </h2>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-1.5 shadow-xs">
          <span className="text-xs font-semibold text-stone-600">Decision Confidence:</span>
          <span className="font-['Space_Grotesk'] text-base font-extrabold text-rose-700">
            {analysis.confidenceScore}%
          </span>
        </div>
      </div>

      {/* Winning Choice Hero Section */}
      <div className="my-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block rounded-xl bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 border border-rose-200 mb-2">
              Recommended Choice
            </span>
            <h3 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              {analysis.recommendedOption}
            </h3>
          </div>

          <button
            onClick={handleFireConfetti}
            className="flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 px-5 py-3 text-xs font-bold text-white hover:from-rose-500 hover:to-amber-400 shadow-md shadow-rose-200 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Sparkles className="h-4 w-4" />
            <span>Lock In & Celebrate</span>
          </button>
        </div>

        {/* Key Takeaway Pill */}
        <div className="mt-4 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-stone-800 italic flex items-center gap-3">
          <Zap className="h-4 w-4 shrink-0 text-amber-500 not-italic" />
          <span>"{analysis.keyTakeaway}"</span>
        </div>

        {/* Rationale description */}
        <div className="mt-4 text-sm sm:text-base leading-relaxed text-stone-700 font-normal">
          {analysis.confidenceRationale}
        </div>
      </div>

      {/* Option Score Snapshot */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {analysis.options.map((opt) => {
          const isWinner = opt.name.toLowerCase() === analysis.recommendedOption.toLowerCase();
          return (
            <div
              key={opt.name}
              className={`rounded-2xl p-4 border transition-all ${
                isWinner
                  ? 'border-rose-300 bg-rose-50/70 shadow-xs'
                  : 'border-stone-200 bg-white/70 text-stone-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wide truncate pr-2 text-stone-850">
                  {opt.name}
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  isWinner ? 'bg-rose-200 text-rose-800' : 'bg-stone-100 text-stone-700'
                }`}>
                  {opt.score}/100
                </span>
              </div>
              <p className="text-xs text-stone-500 line-clamp-1 italic">
                {opt.summaryTagline}
              </p>
            </div>
          );
        })}
      </div>

      {/* Action Plan Checklist */}
      {analysis.actionPlan && analysis.actionPlan.length > 0 && (
        <div className="mb-6 rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Execution Playbook: First Steps
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {analysis.actionPlan.map((step) => (
              <div key={step.step} className="rounded-xl border border-stone-200/80 bg-[#FAF7F2] p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-rose-600">Step {step.step}</span>
                  <span className="text-[10px] font-medium text-stone-500">{step.timeframe}</span>
                </div>
                <p className="text-xs text-stone-800 leading-snug">{step.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenWhatIf}
            className="flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100 transition-all shadow-xs"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            <span>Test a "What-If?" Scenario</span>
          </button>

          <button
            onClick={onOpenDevilsAdvocate}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all shadow-xs"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Devil's Advocate Stress-Test</span>
          </button>
        </div>

        <button
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-all shadow-xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Decision Brief</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
