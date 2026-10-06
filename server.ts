import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Robust Gemini generation with retry and fallbacks for high-demand spikes
async function generateWithGemini(prompt: string, config: any = {}) {
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            ...config,
          },
        });
        if (response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempt + 1} with model ${model} encountered error:`, err?.message || err);
        await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// Primary endpoint: Analyze decision
app.post('/api/decision/analyze', async (req, res) => {
  try {
    const { title, context, options, userPriorities, riskTolerance, timeline } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Please provide a decision title and at least two options.' });
    }

    const prompt = `You are "The Tiebreaker", an expert strategic decision advisor, executive arbitrator, and behavioral psychologist.
Your role is to cut through analysis paralysis, break down difficult choices objectively, analyze pros and cons, build a comparison matrix, run a SWOT analysis, and deliver a clear, well-justified tiebreaker verdict.

Decision Title: "${title}"
Context / Background: "${context || 'No extra context provided.'}"
Options to compare: ${JSON.stringify(options)}
User Priorities & Core Values: ${userPriorities && userPriorities.length > 0 ? JSON.stringify(userPriorities) : 'Balanced evaluation'}
Risk Tolerance: ${riskTolerance || 'moderate'}
Timeline: ${timeline || 'flexible'}

Provide an in-depth, nuanced, yet punchy decision dossier in strict JSON format.

JSON Structure required:
{
  "title": "${title}",
  "summary": "Executive summary of the core tension and stakes in 2-3 sentences.",
  "recommendedOption": "The exact name of the option that wins the tiebreaker",
  "confidenceScore": 85, // integer 50 to 95 reflecting how decisive the choice is
  "confidenceRationale": "Clear 2-3 sentence justification explaining why this option breaks the tie given the user priorities.",
  "keyTakeaway": "A memorable 1-sentence decision rule or aphorism for this choice.",
  "options": [
    {
      "name": "Option Name",
      "score": 82, // integer 1-100 overall score
      "summaryTagline": "Short 4-7 word positioning phrase",
      "bestForPersona": "Who should pick this option (e.g. 'Ideal if you value rapid trajectory over immediate comfort')",
      "pros": [
        {
          "text": "Detailed pro point",
          "impact": "critical" | "high" | "medium",
          "category": "financial" | "growth" | "lifestyle" | "emotional" | "strategic",
          "scoreWeight": 5 // 1 to 5
        }
      ],
      "cons": [
        {
          "text": "Detailed con point",
          "severity": "critical" | "high" | "medium",
          "category": "financial" | "growth" | "lifestyle" | "emotional" | "strategic",
          "mitigation": "Actionable tactic to neutralize or soften this con",
          "scoreWeight": 4 // 1 to 5
        }
      ],
      "swot": {
        "strengths": ["Item 1", "Item 2", "Item 3"],
        "weaknesses": ["Item 1", "Item 2", "Item 3"],
        "opportunities": ["Item 1", "Item 2", "Item 3"],
        "threats": ["Item 1", "Item 2", "Item 3"]
      }
    }
  ],
  "comparisonTable": [
    {
      "criteria": "e.g., Financial Payoff / Compensation",
      "category": "Financial",
      "importance": "high" | "medium" | "low",
      "ratings": {
        "<Option1>": { "score": 8, "note": "Brief explanation" },
        "<Option2>": { "score": 6, "note": "Brief explanation" }
      },
      "winner": "Exact Option Name or 'Tie'"
    }
  ],
  "tiebreakerFrameworks": {
    "tenTenTenRule": {
      "in10Minutes": "How you will likely feel 10 minutes after choosing the recommended option (e.g., brief anxiety/relief)",
      "in10Months": "The reality and progress 10 months later",
      "in10Years": "The enduring legacy/impact 10 years later"
    },
    "regretMinimization": {
      "analysis": "Which path minimizes irreversible regret when looking back at age 80?",
      "whichRegretIsHeavier": "Analysis of error of action vs error of omission"
    },
    "preMortem": [
      {
        "option": "Option Name",
        "failureScenario": "If this option turns out to be a disaster in 12 months, this is the most probable blindspot.",
        "preventionTip": "What concrete rule or safeguard prevents this failure mode."
      }
    ],
    "coinFlipGutCheck": {
      "prompt": "If a coin landed and forced you into [Alternative Option], what is the instant reaction in your chest?",
      "explanation": "Psychological test explaining how to detect your intuitive truth."
    }
  },
  "actionPlan": [
    { "step": 1, "action": "First immediate action within 24 hours", "timeframe": "24 Hours" },
    { "step": 2, "action": "Second checkpoint action", "timeframe": "Week 1" },
    { "step": 3, "action": "Commitment lock-in milestone", "timeframe": "Month 1" }
  ]
}

Ensure:
- Realistic, high-value, highly specific pros/cons (at least 3-5 pros and 3-4 cons per option).
- Realistic ratings in comparisonTable (provide at least 5-7 meaningful criteria like Cost/Financial, Workload/Effort, Upside Potential, Reversibility, Emotional Fulfillment, Alignment with Goals, Stress/Burnout Risk).
- Complete SWOT analysis for EACH option.
- Authentic, deeply thoughtful analysis without generic filler.
- STRICT valid JSON output only with no markdown backticks or commentary outside JSON.`;

    const response = await generateWithGemini(prompt);

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Clean up markdown if any
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      data: {
        id: 'dec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: new Date().toISOString(),
        ...parsedData,
      },
    });
  } catch (err: any) {
    console.error('Error analyzing decision:', err);
    res.status(500).json({
      error: 'Failed to analyze decision',
      details: err?.message || 'Unknown error occurred with AI model.',
    });
  }
});

// Refine / What-If endpoint
app.post('/api/decision/what-if', async (req, res) => {
  try {
    const { originalAnalysis, whatIfPrompt } = req.body;

    if (!originalAnalysis || !whatIfPrompt) {
      return res.status(400).json({ error: 'Original decision analysis and what-if query are required.' });
    }

    const prompt = `You are "The Tiebreaker" decision engine.
The user has an existing decision analysis for "${originalAnalysis.title}".
Current Recommended Option: "${originalAnalysis.recommendedOption}".

The user is now testing a "What If?" scenario or requesting a specific pivot:
"${whatIfPrompt}"

Analyze how this new variable, twist, or condition alters the calculus.
Return a STRICT JSON response:
{
  "scenarioImpact": "Does this shift the tiebreaker verdict, strengthen the current choice, or introduce a new compromise?",
  "verdictChanged": true | false,
  "updatedRecommendation": "Option Name",
  "shiftAnalysis": "Detailed 3-4 sentence explanation of how the risk-reward equation shifted.",
  "adjustedProsCons": [
    {
      "option": "Option Name",
      "type": "new_pro" | "new_con" | "neutralized_con",
      "text": "Description of the shift",
      "impact": "critical" | "high" | "medium"
    }
  ],
  "negotiationOrTacticalLeverage": "Specific tactic, counter-offer, or safety boundary the user can apply right now given this scenario.",
  "bottomLineAdvice": "Crisp 1-2 sentence recommendation for this altered reality."
}
Strict JSON only.`;

    const response = await generateWithGemini(prompt);

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (err: any) {
    console.error('Error in what-if analysis:', err);
    res.status(500).json({
      error: 'Failed to evaluate what-if scenario',
      details: err?.message || 'Unknown error',
    });
  }
});

// Devils Advocate / Stress-test endpoint
app.post('/api/decision/devils-advocate', async (req, res) => {
  try {
    const { title, recommendedOption, context } = req.body;

    const prompt = `You are a rigorous, ruthlessly candid Devil's Advocate interrogator for "The Tiebreaker".
The user is leaning towards or recommended to choose: "${recommendedOption}" for the decision "${title}".
Context: "${context || 'No extra context'}"

Your job is NOT to be mean, but to protect the user from confirmation bias, sunk cost fallacy, emotional wishful thinking, and unexamined blindspots.

Return a STRICT JSON response:
{
  "harshTruth": "The blunt, uncomfortable reality the user might be glossing over in 2 sentences.",
  "threeToughQuestions": [
    "Hard hitting question 1 that forces self-honesty",
    "Hard hitting question 2",
    "Hard hitting question 3"
  ],
  "hiddenCosts": [
    "Unseen financial, energy, or relationship tax",
    "Second unseen cost"
  ],
  "theWorstCaseDefense": "How to stress-test whether you can survive the worst-case scenario if you choose this option.",
  "verdictValidation": "How the user will know they are making this choice out of strength rather than fear or laziness."
}
Strict JSON only.`;

    const response = await generateWithGemini(prompt);

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (err: any) {
    console.error('Error in devils advocate:', err);
    res.status(500).json({
      error: 'Failed to generate devil advocate challenge',
      details: err?.message || 'Unknown error',
    });
  }
});

// Vite middleware in dev or static files in prod
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
