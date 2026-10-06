export interface ProItem {
  text: string;
  impact: 'critical' | 'high' | 'medium';
  category: 'financial' | 'growth' | 'lifestyle' | 'emotional' | 'strategic';
  scoreWeight: number; // 1 to 5
}

export interface ConItem {
  text: string;
  severity: 'critical' | 'high' | 'medium';
  category: 'financial' | 'growth' | 'lifestyle' | 'emotional' | 'strategic';
  mitigation?: string;
  scoreWeight: number; // 1 to 5
}

export interface SwotQuadrant {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DecisionOption {
  name: string;
  score: number;
  summaryTagline: string;
  bestForPersona: string;
  pros: ProItem[];
  cons: ConItem[];
  swot: SwotQuadrant;
}

export interface ComparisonCriterion {
  criteria: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  ratings: Record<string, { score: number; note: string }>;
  winner: string;
}

export interface TiebreakerFrameworks {
  tenTenTenRule: {
    in10Minutes: string;
    in10Months: string;
    in10Years: string;
  };
  regretMinimization: {
    analysis: string;
    whichRegretIsHeavier: string;
  };
  preMortem: {
    option: string;
    failureScenario: string;
    preventionTip: string;
  }[];
  coinFlipGutCheck: {
    prompt: string;
    explanation: string;
  };
}

export interface ActionPlanStep {
  step: number;
  action: string;
  timeframe: string;
}

export interface DecisionAnalysis {
  id: string;
  createdAt: string;
  title: string;
  summary: string;
  recommendedOption: string;
  confidenceScore: number;
  confidenceRationale: string;
  keyTakeaway: string;
  options: DecisionOption[];
  comparisonTable: ComparisonCriterion[];
  tiebreakerFrameworks: TiebreakerFrameworks;
  actionPlan: ActionPlanStep[];
}

export interface WhatIfResult {
  scenarioImpact: string;
  verdictChanged: boolean;
  updatedRecommendation: string;
  shiftAnalysis: string;
  adjustedProsCons: {
    option: string;
    type: 'new_pro' | 'new_con' | 'neutralized_con';
    text: string;
    impact: 'critical' | 'high' | 'medium';
  }[];
  negotiationOrTacticalLeverage: string;
  bottomLineAdvice: string;
}

export interface DevilsAdvocateResult {
  harshTruth: string;
  threeToughQuestions: string[];
  hiddenCosts: string[];
  theWorstCaseDefense: string;
  verdictValidation: string;
}

export interface DecisionInputForm {
  title: string;
  context: string;
  options: string[];
  userPriorities: string[];
  riskTolerance: 'low' | 'moderate' | 'high';
  timeline: 'immediate' | '1-3 months' | '6+ months';
}
