import React from 'react';
import { Scale, Sparkles, History, BookmarkCheck, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  savedCount: number;
  hasActiveDecision: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  savedCount,
  hasActiveDecision,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/75 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-200 via-amber-100 to-teal-100 shadow-md shadow-rose-100 ring-1 ring-rose-200/60 group-hover:shadow-rose-200 transition-all">
            <Scale className="h-5 w-5 text-stone-800 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-400"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-stone-850 group-hover:text-rose-600 transition-colors">
                The Tiebreaker
              </span>
              <span className="rounded-full bg-rose-100/80 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200/60 tracking-wider">
                DECISION COMPANION
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Gentle clarity • Weighed trade-offs • Peaceful closure
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 transition-all shadow-xs"
            title="Saved Decisions History"
          >
            <History className="h-3.5 w-3.5 text-rose-500" />
            <span>History</span>
            {savedCount > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-100 px-1 text-[10px] font-extrabold text-rose-700">
                {savedCount}
              </span>
            )}
          </button>

          {hasActiveDecision && (
            <button
              onClick={onNewDecision}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 px-3.5 py-1.5 text-xs font-bold text-white hover:from-rose-500 hover:to-amber-400 shadow-sm shadow-rose-200 active:scale-95 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>New Decision</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
