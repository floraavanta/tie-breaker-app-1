# The Tiebreaker

An AI-powered decision-making app that helps you resolve tough dilemmas and cut through analysis paralysis. Enter 2-4 options, add your constraints and priorities, and get a clear recommendation with the reasoning behind it.

**Live demo:** https://the-tiebreaker-5675.ai.studio

## What it does

Describe a decision (for example, career pivot vs. enterprise stability, or buy a home vs. rent and invest). The app uses Google's Gemini to analyze your options against what matters to you, such as career trajectory, financial upside, work-life balance, mental peace and autonomy.

## Features

- **Decision input and presets:** 2-4 options, with constraints, budget or salary differences, timelines and priority values. Presets for common dilemmas.
- **Verdict and confidence meter:** a recommendation with a confidence score, a rationale tied to your priorities, and a 3-step action plan (24 hours, week 1, month 1).
- **Weighted pros and cons:** impact badges, category tags and suggested mitigations for each downside. Adjust weights to see the net balance change, or add your own points.
- **Head-to-head comparison matrix:** options scored 1-10 across dimensions like financial payoff, effort, upside, reversibility, burnout risk and goal alignment.
- **SWOT analysis:** strengths, weaknesses, opportunities and threats for each option.
- **Decision frameworks:** 10/10/10 rule, regret minimization test, pre-mortem analysis, and an interactive coin-toss gut check.
- **What-if simulator and devil's advocate:** change variables to see how the verdict shifts, and challenge your own reasoning.
- **History and export:** local history, JSON backup, and print/PDF-ready output.

## Built with

- Google AI Studio (Build mode)
- Gemini API

## Run locally

1. Clone the repo
2. Install dependencies: `npm install`
3. Add your own Gemini API key to a `.env` file (get one from Google AI Studio). Do not commit it.
4. Start the app: `npm run dev`

## Context

Built as a project for Google AI for app buiding on Coursera by Umema Ali.
