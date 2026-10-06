import React from 'react';
import { X, History, Trash2, ArrowRight, Download, Calendar, Award } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedDecisions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `the_tiebreaker_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-2xl shadow-rose-100/60">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-rose-500" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-stone-900">
              Decision History ({savedDecisions.length})
            </h3>
          </div>

          {savedDecisions.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-[#FCFAF7] shadow-xs"
                title="Download JSON backup"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
              <button
                onClick={onClearAll}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1"
                title="Clear all saved"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {savedDecisions.length === 0 ? (
          <div className="py-12 text-center text-stone-500">
            <History className="h-8 w-8 mx-auto mb-2 opacity-40 text-stone-400" />
            <p className="text-sm font-semibold text-stone-700">No saved decisions yet.</p>
            <p className="text-xs text-stone-500 mt-1">
              Any decision you analyze with The Tiebreaker will automatically be saved here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedDecisions.map((dec) => {
              const formattedDate = new Date(dec.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={dec.id}
                  className="group rounded-2xl border border-stone-200 bg-[#FAF7F2] p-4.5 transition-all hover:border-rose-300 hover:bg-rose-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1 flex-1 cursor-pointer" onClick={() => onSelectDecision(dec)}>
                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-rose-700 transition-colors">
                      {dec.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1 text-rose-700 font-bold">
                        <Award className="h-3.5 w-3.5" />
                        Verdict: {dec.recommendedOption}
                      </span>
                      <span className="flex items-center gap-1 text-stone-500">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                      <span className="bg-stone-200/80 px-2 py-0.5 rounded-md text-[10px] text-stone-700 font-bold">
                        {dec.confidenceScore}% confidence
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onSelectDecision(dec)}
                      className="flex items-center gap-1 rounded-xl bg-rose-100 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-200 transition-all shadow-xs"
                    >
                      <span>Open</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteDecision(dec.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
