import { DecisionInputForm } from '../types';

export const SAMPLE_PRESETS: { label: string; icon: string; data: DecisionInputForm }[] = [
  {
    label: 'Career Pivot vs Enterprise Stability',
    icon: '💼',
    data: {
      title: 'Join Early-Stage AI Startup as Lead Engineer vs Stay as Senior at Stable Tech Giant',
      context: 'Current job offers $195k base + $50k RSU with very predictable 35 hr/wk workload, but growth has stagnated and tech is legacy. The startup offers $160k base + 1.2% equity, 50 hr/wk, fast pace, high learning curve, but 18 months runway.',
      options: ['Accept Startup Lead Offer', 'Stay at Stable Tech Giant'],
      userPriorities: ['Career Growth', 'Skill Acceleration', 'Financial Upside', 'Work-Life Balance'],
      riskTolerance: 'moderate',
      timeline: 'immediate',
    },
  },
  {
    label: 'Buy Suburban Home vs Rent & Invest',
    icon: '🏡',
    data: {
      title: 'Buy a 3-Bedroom Suburban House vs Keep Renting in City & Maximize Index Fund Investing',
      context: 'Mortgage + tax + HOA would be $3,800/mo ($1,200 more than current $2,600 rent) and require $120k down payment (depleting 60% of liquid savings). In exchange: yard, more space, equity build. Renting allows continuing $2k/mo into S&P500 index funds and walkable lifestyle.',
      options: ['Buy Suburban House', 'Rent Downtown & Invest Difference'],
      userPriorities: ['Long-term Wealth', 'Lifestyle Freedom', 'Family Stability', 'Liquidity'],
      riskTolerance: 'moderate',
      timeline: '1-3 months',
    },
  },
  {
    label: 'Relocate Overseas vs Stay Rooted',
    icon: '✈️',
    data: {
      title: 'Move Abroad to Tokyo for a 2-Year International Assignment vs Stay Put in Current City',
      context: 'Company is offering an expat package with housing stipend to lead a team in Tokyo for 2 years. Partner can work remotely part-time. Leaving would mean pausing current social circle, putting hobbies on hold, and navigating a language barrier, but huge personal horizon expansion.',
      options: ['Accept Tokyo Assignment', 'Decline & Stay in Current City'],
      userPriorities: ['Life Adventure', 'Cultural Growth', 'Relationship Strength', 'Comfort & Network'],
      riskTolerance: 'high',
      timeline: '1-3 months',
    },
  },
  {
    label: 'Bootstrap Indie SaaS vs Raise VC Seed',
    icon: '🚀',
    data: {
      title: 'Bootstrap B2B SaaS to $20k MRR vs Raise $1.5M Seed Round to Hire and Scale Fast',
      context: 'Product is currently generating $4k MRR with 15% month-over-month organic growth. Two angel investors offered a term sheet for $1.5M at $8M post-money. Raising means giving up 18% equity, having board oversight, and committing to 100x blitzscale or bust. Bootstrapping keeps 100% ownership and peaceful life.',
      options: ['Bootstrap Sustainably (100% Equity)', 'Raise $1.5M Seed Round to Blitzscale'],
      userPriorities: ['Autonomy & Control', 'Maximum Financial Upside', 'Stress & Mental Peace', 'Speed to Market'],
      riskTolerance: 'high',
      timeline: 'immediate',
    },
  },
];
