import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, ArrowRight, Lightbulb, Compass, Zap, Shield, Clock } from 'lucide-react';
import { DecisionInputForm } from '../types';
import { SAMPLE_PRESETS } from '../data/presets';

interface DecisionFormProps {
  onSubmit: (formData: DecisionInputForm) => void;
  isLoading: boolean;
  loadingStep: string;
}

const COMMON_PRIORITIES = [
  'Career Trajectory',
  'Financial Upside',
  'Work-Life Balance',
  'Mental Peace',
  'Low Risk / Stability',
  'Autonomy & Freedom',
  'Learning Speed',
  'Family & Relationships',
  'Long-term Health',
  'Adventure / Novelty',
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  loadingStep,
}) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<string[]>(['Option A: ', 'Option B: ']);
  const [userPriorities, setUserPriorities] = useState<string[]>([
    'Career Trajectory',
    'Financial Upside',
    'Work-Life Balance',
  ]);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [timeline, setTimeline] = useState<'immediate' | '1-3 months' | '6+ months'>('1-3 months');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddOption = () => {
    if (options.length >= 4) return;
    setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}: `]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const togglePriority = (priority: string) => {
    if (userPriorities.includes(priority)) {
      setUserPriorities(userPriorities.filter((p) => p !== priority));
    } else {
      if (userPriorities.length < 5) {
        setUserPriorities([...userPriorities, priority]);
      }
    }
  };

  const applyPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setTitle(preset.data.title);
    setContext(preset.data.context);
    setOptions(preset.data.options);
    setUserPriorities(preset.data.userPriorities);
    setRiskTolerance(preset.data.riskTolerance);
    setTimeline(preset.data.timeline);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setValidationError('Please enter what decision you need to make.');
      return;
    }

    const cleanOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (cleanOptions.length < 2) {
      setValidationError('Please provide at least 2 distinct options to compare.');
      return;
    }

    onSubmit({
      title: cleanTitle,
      context: context.trim(),
      options: cleanOptions,
      userPriorities,
      riskTolerance,
      timeline,
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Hero Intro */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 border border-rose-200/80 px-4 py-1.5 text-xs font-bold text-rose-700 mb-3 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-rose-500" />
          <span>Soft Weighing • SWOT Clarity • Decisive Peace of Mind</span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-3xl font-extrabold tracking-tight text-stone-850 sm:text-5xl">
          Torn between choices? <br />
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            Let's break the tie gently.
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-stone-600">
          Share your dilemma. We will calmly unpack the trade-offs, compare your options side-by-side, and deliver an intuitive, balanced verdict.
        </p>

        {/* Quick Presets */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Try a sample:
          </span>
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="group flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white/90 px-3 py-1.5 text-xs text-stone-700 hover:border-rose-300 hover:bg-rose-50/60 hover:text-stone-900 transition-all shadow-xs"
            >
              <span>{preset.icon}</span>
              <span className="font-medium">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl border border-stone-200/80 bg-white/85 p-6 sm:p-9 backdrop-blur-md shadow-xl shadow-stone-200/50">
        {validationError && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-700">
            {validationError}
          </div>
        )}

        {/* Decision Title */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-stone-800 mb-2">
            What is the decision you need to make? <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Take the Senior Offer at Startup vs Stay at Current Tech Giant"
            className="w-full rounded-2xl border border-stone-200 bg-[#FCFAF7] px-4 py-3.5 text-sm sm:text-base text-stone-850 placeholder-stone-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all shadow-inner"
            disabled={isLoading}
          />
        </div>

        {/* Options to compare */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-stone-800">
              The Options on the Table <span className="text-rose-500">*</span>
            </label>
            {options.length < 4 && (
              <button
                type="button"
                onClick={handleAddOption}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Another Option
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-xs font-bold text-rose-700 border border-rose-200">
                  #{index + 1}
                </div>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1} name`}
                  className="flex-1 rounded-2xl border border-stone-200 bg-[#FCFAF7] px-4 py-2.5 text-sm text-stone-850 placeholder-stone-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  disabled={isLoading}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    disabled={isLoading}
                    className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Remove option"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Context & Background Details */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-stone-800 mb-2">
            Context, Numbers & Dilemmas <span className="text-xs font-normal text-stone-500">(Optional, but gives much richer clarity)</span>
          </label>
          <textarea
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Include salary differences, fears, commute, family considerations, runway, or any gut feelings you have..."
            className="w-full rounded-2xl border border-stone-200 bg-[#FCFAF7] px-4 py-3 text-sm text-stone-850 placeholder-stone-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all resize-y shadow-inner"
            disabled={isLoading}
          />
        </div>

        {/* Priorities & Values */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-stone-800 mb-2">
            What matters most to you right now? <span className="text-xs font-normal text-stone-500">(Pick up to 5)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_PRIORITIES.map((priority) => {
              const isSelected = userPriorities.includes(priority);
              return (
                <button
                  key={priority}
                  type="button"
                  onClick={() => togglePriority(priority)}
                  disabled={isLoading}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 shadow-xs'
                      : 'border border-stone-200 bg-white/90 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {priority} {isSelected ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Risk & Timeline Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pt-5 border-t border-stone-200">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2">
              <Shield className="h-3.5 w-3.5 text-rose-500" /> Risk Tolerance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'moderate', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRiskTolerance(level)}
                  disabled={isLoading}
                  className={`rounded-xl py-2 text-xs font-bold capitalize transition-all ${
                    riskTolerance === level
                      ? 'bg-gradient-to-r from-rose-200 via-pink-200 to-amber-100 text-stone-900 border border-rose-300 shadow-xs'
                      : 'border border-stone-200 bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2">
              <Clock className="h-3.5 w-3.5 text-rose-500" /> Decision Timeline
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['immediate', '1-3 months', '6+ months'] as const).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setTimeline(time)}
                  disabled={isLoading}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    timeline === time
                      ? 'bg-gradient-to-r from-rose-200 via-pink-200 to-amber-100 text-stone-900 border border-rose-300 shadow-xs'
                      : 'border border-stone-200 bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 py-4 px-6 font-['Space_Grotesk'] text-base font-bold text-white shadow-lg shadow-rose-200/80 transition-all hover:shadow-xl hover:shadow-rose-300/80 hover:from-rose-500 hover:to-amber-400 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="font-bold text-white">{loadingStep || 'Weighing with care...'}</span>
            </div>
          ) : (
            <>
              <Zap className="h-5 w-5 fill-white" />
              <span>Break The Tie With Clarity</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
