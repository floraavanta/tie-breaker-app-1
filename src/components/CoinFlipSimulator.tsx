import React, { useState } from 'react';
import { Coins, Sparkles, HeartHandshake, Eye } from 'lucide-react';

interface CoinFlipSimulatorProps {
  options: string[];
}

export const CoinFlipSimulator: React.FC<CoinFlipSimulatorProps> = ({ options }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [flipCount, setFlipCount] = useState(0);

  const optA = options[0] || 'Option 1';
  const optB = options[1] || 'Option 2';

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const chosen = Math.random() > 0.5 ? optA : optB;
      setResult(chosen);
      setIsFlipping(false);
      setFlipCount((prev) => prev + 1);
    }, 1200);
  };

  return (
    <div className="rounded-3xl border border-rose-200/90 bg-gradient-to-b from-[#FFFDF9] via-white to-[#FFF5ED] p-7 text-center shadow-xs">
      <div className="flex items-center justify-center gap-2 text-rose-600 mb-2">
        <Coins className="h-5 w-5" />
        <h4 className="font-['Space_Grotesk'] text-base font-bold text-stone-900 uppercase tracking-wider">
          The Subconscious Coin-Toss Test
        </h4>
      </div>
      <p className="max-w-md mx-auto text-xs text-stone-600 mb-6">
        Sigmund Freud noted that flipping a coin doesn't make the decision for you—rather, the instant the coin is in the air, your brain suddenly realizes which side it hopes lands face up.
      </p>

      {/* Coin Animation Box */}
      <div className="relative mx-auto my-4 flex h-32 w-32 items-center justify-center">
        <div
          className={`h-28 w-28 rounded-full border-4 border-rose-200 bg-gradient-to-tr from-rose-200 via-amber-100 to-pink-200 shadow-xl shadow-rose-100 flex items-center justify-center p-3 text-stone-850 font-['Space_Grotesk'] font-extrabold text-center transition-all cursor-pointer ${
            isFlipping ? 'animate-spin scale-110' : 'hover:scale-105 active:scale-95'
          }`}
          onClick={handleFlip}
        >
          {isFlipping ? (
            <Coins className="h-10 w-10 text-rose-600 animate-pulse" />
          ) : result ? (
            <span className="text-xs leading-tight line-clamp-2 px-1 text-stone-900 font-bold">
              {result}
            </span>
          ) : (
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
              Flip Me
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleFlip}
          disabled={isFlipping}
          className="rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 px-6 py-2.5 text-xs font-bold text-white hover:from-rose-500 hover:to-amber-400 shadow-md shadow-rose-200 active:scale-95 transition-all disabled:opacity-50"
        >
          {isFlipping ? 'Coin in mid-air...' : flipCount > 0 ? 'Toss Again' : 'Toss the Tiebreaker Coin'}
        </button>
      </div>

      {result && !isFlipping && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-white p-5 max-w-lg mx-auto text-left shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-rose-700 mb-1.5">
            <HeartHandshake className="h-4 w-4" />
            <span>The Gut-Check Moment</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-850 leading-relaxed">
            The coin landed on <span className="font-extrabold text-rose-700">"{result}"</span>.
          </p>
          <p className="text-xs text-stone-700 mt-2.5 bg-rose-50/80 p-3 rounded-xl border border-rose-200/70 italic">
            "Did your stomach drop in mild disappointment, or did you feel a subtle wave of relief? Whatever you felt in that split second is your honest subconscious preference."
          </p>
        </div>
      )}
    </div>
  );
};
