import React, { useState } from 'react';
import { Table, Trophy, Filter, ArrowUpDown, Info } from 'lucide-react';
import { ComparisonCriterion, DecisionOption } from '../types';

interface ComparisonTableViewProps {
  criteria: ComparisonCriterion[];
  options: DecisionOption[];
  recommendedOption: string;
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  criteria,
  options,
  recommendedOption,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(criteria.map((c) => c.category).filter(Boolean)))];

  const filteredCriteria = criteria.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesImportance = selectedImportance === 'all' || c.importance.toLowerCase() === selectedImportance.toLowerCase();
    return matchesCategory && matchesImportance;
  });

  // Calculate criteria wins tally
  const winsTally: Record<string, number> = {};
  options.forEach((opt) => {
    winsTally[opt.name] = 0;
  });
  criteria.forEach((c) => {
    if (winsTally[c.winner] !== undefined) {
      winsTally[c.winner] += 1;
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 5) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2">
          <Table className="h-4 w-4 text-rose-500" />
          <h3 className="font-['Space_Grotesk'] text-base font-bold text-stone-900">
            Head-to-Head Comparison Matrix
          </h3>
          <span className="text-xs text-stone-500">({filteredCriteria.length} criteria)</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Filter className="h-3 w-3" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-700 focus:border-rose-400 focus:outline-none shadow-xs"
            >
              <option value="all">All Categories</option>
              {categories.filter((c) => c !== 'all').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedImportance}
            onChange={(e) => setSelectedImportance(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-700 focus:border-rose-400 focus:outline-none shadow-xs"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority Only</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Criteria Wins Summary Tally Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isWinner = opt.name.toLowerCase() === recommendedOption.toLowerCase();
          const wins = winsTally[opt.name] || 0;
          return (
            <div
              key={opt.name}
              className={`rounded-2xl border p-3.5 text-center transition-all ${
                isWinner
                  ? 'border-rose-300 bg-rose-50/70 shadow-xs'
                  : 'border-stone-200 bg-white/80'
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-600 truncate mb-1">
                {opt.name}
              </div>
              <div className="font-['Space_Grotesk'] text-2xl font-extrabold text-stone-900 flex items-center justify-center gap-1">
                <Trophy className={`h-4 w-4 ${isWinner ? 'text-rose-500' : 'text-stone-400'}`} />
                <span>{wins}</span>
                <span className="text-xs font-normal text-stone-500">/ {criteria.length} won</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white/80 shadow-xs">
        <table className="w-full text-left text-sm text-stone-700">
          <thead className="border-b border-stone-200 bg-[#FCFAF7] text-[11px] font-bold uppercase tracking-wider text-stone-600">
            <tr>
              <th className="py-4 px-5 w-1/4 min-w-[200px]">Evaluation Criterion</th>
              {options.map((opt) => (
                <th key={opt.name} className="py-4 px-5 min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-900 font-bold">{opt.name}</span>
                    {opt.name.toLowerCase() === recommendedOption.toLowerCase() && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-extrabold text-rose-700">
                        Pick
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="py-4 px-5 text-center min-w-[120px]">Dimension Winner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredCriteria.map((c, idx) => (
              <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                {/* Criterion Name & Category */}
                <td className="py-4 px-5 align-top">
                  <div className="font-bold text-stone-900 text-sm">{c.criteria}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {c.category && (
                      <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                        {c.category}
                      </span>
                    )}
                    <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                      c.importance === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {c.importance}
                    </span>
                  </div>
                </td>

                {/* Ratings per option */}
                {options.map((opt) => {
                  const rating = c.ratings?.[opt.name] || { score: 6, note: '-' };
                  const isDimensionWinner = c.winner.toLowerCase() === opt.name.toLowerCase();
                  return (
                    <td
                      key={opt.name}
                      className={`py-4 px-5 align-top ${
                        isDimensionWinner ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${getScoreColor(rating.score)}`}>
                          {rating.score}/10
                        </span>
                        {isDimensionWinner && (
                          <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                            ★ Leads
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-snug">
                        {rating.note}
                      </p>
                    </td>
                  );
                })}

                {/* Dimension Winner Badge */}
                <td className="py-4 px-5 align-middle text-center">
                  <span className="inline-block rounded-xl border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 shadow-2xs">
                    {c.winner}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
