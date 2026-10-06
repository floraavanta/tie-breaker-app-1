/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { TiebreakerVerdictCard } from './components/TiebreakerVerdictCard';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotView } from './components/SwotView';
import { PsychologicalFrameworksView } from './components/PsychologicalFrameworksView';
import { WhatIfScenarioModal } from './components/WhatIfScenarioModal';
import { DevilsAdvocateDrawer } from './components/DevilsAdvocateDrawer';
import { HistoryModal } from './components/HistoryModal';
import { DecisionAnalysis, DecisionInputForm } from './types';
import { Scale, CheckCircle, BarChart3, ShieldCheck, Compass, Sparkles, Printer, Share2 } from 'lucide-react';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions';

export default function App() {
  const [activeDecision, setActiveDecision] = useState<DecisionAnalysis | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active view tab in results
  const [activeTab, setActiveTab] = useState<'verdict' | 'proscons' | 'table' | 'swot' | 'psych'>('verdict');

  // Modals
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isDevilsAdvocateOpen, setIsDevilsAdvocateOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load saved decisions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedDecisions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse saved decisions:', e);
    }
  }, []);

  // Save decisions to localStorage
  const saveDecisionToHistory = (newDec: DecisionAnalysis) => {
    setSavedDecisions((prev) => {
      const filtered = prev.filter((d) => d.id !== newDec.id);
      const updated = [newDec, ...filtered];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to store decisions:', e);
      }
      return updated;
    });
  };

  const handleAnalyzeDecision = async (formData: DecisionInputForm) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Reviewing dilemma & priorities...');

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev.includes('Reviewing')) return 'Cataloging pros, cons & trade-offs...';
        if (prev.includes('Cataloging')) return 'Assembling side-by-side comparison matrix...';
        if (prev.includes('comparison')) return 'Constructing SWOT analysis & regret test...';
        if (prev.includes('SWOT')) return 'Delivering the Tiebreaker verdict...';
        return prev;
      });
    }, 1800);

    try {
      const res = await fetch('/api/decision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.details || json.error || 'Failed to analyze decision.');
      }

      const decision: DecisionAnalysis = json.data;
      setActiveDecision(decision);
      setActiveTab('verdict');
      saveDecisionToHistory(decision);
    } catch (err: any) {
      console.error('Error analyzing decision:', err);
      setErrorMessage(err?.message || 'Failed to reach AI arbitrator. Please try again.');
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSelectFromHistory = (dec: DecisionAnalysis) => {
    setActiveDecision(dec);
    setActiveTab('verdict');
    setIsHistoryOpen(false);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setSavedDecisions((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    setSavedDecisions([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-850 flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900">
      {/* Header */}
      <Header
        onNewDecision={() => setActiveDecision(null)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedDecisions.length}
        hasActiveDecision={Boolean(activeDecision)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {errorMessage && (
          <div className="mx-auto max-w-4xl px-4 pt-6">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-700 flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="font-bold underline ml-3"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!activeDecision ? (
          /* Decision Input View */
          <DecisionForm
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        ) : (
          /* Results Dossier View */
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
            {/* Top Navigation Bar: Decision Title & View Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5 mb-1">
                  <Scale className="h-3.5 w-3.5" />
                  Decision Dossier
                </span>
                <h1 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-extrabold text-stone-900">
                  {activeDecision.title}
                </h1>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl line-clamp-2">
                  {activeDecision.summary}
                </p>
              </div>

              {/* Action buttons (Print, etc.) */}
              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-all shadow-xs"
                  title="Print or Save as PDF"
                >
                  <Printer className="h-3.5 w-3.5 text-stone-500" />
                  <span>Print Brief</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-stone-200/80 pb-3">
              {[
                { id: 'verdict', label: '🎯 The Verdict', desc: 'Tiebreaker & Playbook' },
                { id: 'proscons', label: '⚖️ Pros & Cons', desc: 'Weighted trade-offs' },
                { id: 'table', label: '📊 Comparison Table', desc: 'Head-to-head matrix' },
                { id: 'swot', label: '🧭 SWOT Matrix', desc: '4-quadrant strategic audit' },
                { id: 'psych', label: '🧠 Gut & Regret Tests', desc: '10/10/10, Pre-mortem, Coin toss' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-rose-100 text-rose-800 border border-rose-300 shadow-xs'
                        : 'border border-stone-200 bg-white/90 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content */}
            <div className="pt-2">
              {activeTab === 'verdict' && (
                <div className="space-y-6">
                  <TiebreakerVerdictCard
                    analysis={activeDecision}
                    onOpenWhatIf={() => setIsWhatIfOpen(true)}
                    onOpenDevilsAdvocate={() => setIsDevilsAdvocateOpen(true)}
                  />

                  {/* Summary preview of Pros/Cons & Table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div
                      onClick={() => setActiveTab('proscons')}
                      className="group cursor-pointer rounded-3xl border border-stone-200 bg-white/80 p-6 hover:border-rose-300 hover:bg-rose-50/20 transition-all shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-rose-700 transition-colors">
                          Weighed Pros & Cons
                        </h4>
                        <span className="text-xs text-rose-600 font-bold">View Full List →</span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Examine all {activeDecision.options.reduce((acc, o) => acc + o.pros.length + o.cons.length, 0)} strategic pros & cons with impact scoring and actionable mitigation tactics.
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab('table')}
                      className="group cursor-pointer rounded-3xl border border-stone-200 bg-white/80 p-6 hover:border-rose-300 hover:bg-rose-50/20 transition-all shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-rose-700 transition-colors">
                          Comparison Matrix
                        </h4>
                        <span className="text-xs text-rose-600 font-bold">View Table →</span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Evaluate options across {activeDecision.comparisonTable.length} distinct dimensions including risk, effort, upside, and reversibility.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'proscons' && (
                <ProsConsView
                  options={activeDecision.options}
                  recommendedOption={activeDecision.recommendedOption}
                />
              )}

              {activeTab === 'table' && (
                <ComparisonTableView
                  criteria={activeDecision.comparisonTable}
                  options={activeDecision.options}
                  recommendedOption={activeDecision.recommendedOption}
                />
              )}

              {activeTab === 'swot' && (
                <SwotView
                  options={activeDecision.options}
                  recommendedOption={activeDecision.recommendedOption}
                />
              )}

              {activeTab === 'psych' && (
                <PsychologicalFrameworksView
                  frameworks={activeDecision.tiebreakerFrameworks}
                  options={activeDecision.options}
                  recommendedOption={activeDecision.recommendedOption}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {activeDecision && (
        <>
          <WhatIfScenarioModal
            isOpen={isWhatIfOpen}
            onClose={() => setIsWhatIfOpen(false)}
            analysis={activeDecision}
          />
          <DevilsAdvocateDrawer
            isOpen={isDevilsAdvocateOpen}
            onClose={() => setIsDevilsAdvocateOpen(false)}
            analysis={activeDecision}
          />
        </>
      )}

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectFromHistory}
        onDeleteDecision={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
