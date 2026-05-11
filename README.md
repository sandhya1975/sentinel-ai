# 🛡️ SENTINEL — AI Quality Governance Agent

> **The world's first inline AI decision quality inspector.**  
> Scores every AI agent output **GREEN / AMBER / RED** before it reaches a human — with a full audit trail, drift detection, and self-correction. Built for enterprise. NHS-grade. EU AI Act compliant.

---

## The Problem No One Has Solved (Until Now)

Every production AI pipeline shares the same critical gap:

```
AI Agent produces output → Output reaches humans or downstream systems → Damage discovered (too late)
```

No existing system catches hallucinations **inline**, **mid-pipeline**, **before output reaches a human**, with a **full, queryable audit trail**.

**SENTINEL does.**

---

## What SENTINEL Does

```
Job Email Arrives
      ↓
AI Recruiter Agent evaluates candidate
      ↓
 ┌─────────────────────────────┐
 │        SENTINEL             │
 │  Scores output on 6 axes    │
 │  in < 3 seconds             │
 └────────────┬────────────────┘
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
  GREEN      AMBER      RED
  Ship it   Human      BLOCKED
            Review     Instantly
                    + Telegram Alert
                    + Full Audit Log
                    + Self-Correction
                      Prompt Generated
```

---

## Architecture

| Layer | Technology | Role |
|---|---|---|
| **Orchestration** | n8n | Workflow automation & pipeline routing |
| **AI Reasoning** | Claude API (Anthropic) | Decision evaluation & self-correction |
| **Vector Store** | Pinecone | CV / document semantic retrieval |
| **Audit Database** | PostgreSQL (Railway) | Immutable decision log, 7-year retention |
| **Alerting** | Telegram Bot | Real-time RED/AMBER notifications |
| **Browser Automation** | Playwright | Application submission automation |

---

## The 6-Point Scoring Rubric

Every AI decision is evaluated on **6 non-negotiable dimensions**:

| # | Dimension | What It Checks |
|---|---|---|
| 1 | **Factual Accuracy** | Every claim supported by source context |
| 2 | **Hallucination Check** | Any invented data = immediate RED, no exceptions |
| 3 | **Bias & Fairness** | Equality Act 2010 / protected characteristics |
| 4 | **Regulatory Compliance** | NHS / FCA / EU AI Act rules |
| 5 | **Completeness** | Did the agent actually answer what was asked? |
| 6 | **Confidence Calibration** | Is uncertainty expressed where uncertainty exists? |

**Score 5–6 → 🟢 GREEN (ship)**  
**Score 3–4 or any dimension weak → 🟡 AMBER (human review)**  
**Score 0–2 or any hallucination or bias → 🔴 RED (blocked instantly)**

---

## Core Components

### 🎬 Replay Engine — The Flight Recorder
Every decision is stored verbatim and queryable forever:
- Exact prompt sent to the agent
- Exact response received
- Source documents used
- SENTINEL score + verdict
- Plain-English explanation of why it was blocked
- Retry guidance

> *"Any human can click REPLAY and see what the AI saw, what it decided, and why SENTINEL blocked it."*

### 📊 Trust Score Engine — Drift Detection
Each agent carries a rolling 100-decision Trust Score:
- 🟢 **90–100%** = Trusted Agent — deploy freely
- 🟡 **70–89%** = Monitored Agent — 25% output sampling
- 🔴 **Below 70%** = Suspended Agent — all outputs blocked

Drift alerts fire automatically to Telegram when an agent drops 15+ points in 24 hours or produces 3 REDs in 60 minutes.

### 🔗 Chain of Custody — Contamination Firewall
In multi-agent pipelines, hallucinations spread silently:

`Agent A hallucinates → Agent B uses that output → Agent C acts on it → damage compounds`

SENTINEL tracks the full chain. If Agent A produces RED — **all downstream agents pause instantly**. No agent proceeds on tainted data.

### 🔄 Self-Correction Loop — It Teaches, Not Just Blocks
After every RED or AMBER verdict, SENTINEL generates:
- Which of the 6 dimensions failed and why
- The exact quote from the output that triggered the block
- A corrected prompt to retry with
- Classification: RETRY / REPHRASE / ADD_CONTEXT / ESCALATE

> *"Not a stop sign. A traffic controller."*

---

## Compliance

| Standard | Status |
|---|---|
| **EU AI Act** | ✅ Audit trail, human oversight, explainability |
| **NHS Clinical Safety** | ✅ Evidence-based verdicts, no unverified claims |
| **FCA (Financial Conduct)** | ✅ Source-verified figures only |
| **Equality Act 2010** | ✅ Bias detection on every decision |
| **GDPR** | ✅ 7-year retention, immutable audit log |

---

## Live Demo Scenario

> A job application email arrives. The AI Recruiter Agent evaluates the candidate and flags an NHS experience discrepancy. SENTINEL scores the output RED — hallucinated policy reference detected. Telegram fires instantly. The Replay Engine shows the full chain: what the agent saw, what it claimed, what the source actually says. Trust Score drops live. Self-correction prompt generated.

**Total pipeline: email in → blocked decision + full audit trail in under 10 seconds.**

---

## Repository Structure

```
sentinel/
├── docs/
│   ├── SENTINEL_MASTER_PROMPT.md      # Full system prompt & scoring rubric
│   ├── REPLAY_ENGINE.md               # Flight recorder specification
│   ├── TRUST_SCORE_ENGINE.md          # Drift detection design
│   ├── CHAIN_OF_CUSTODY.md            # Multi-agent contamination rules
│   └── SELF_CORRECTION_LOOP.md        # Correction guidance specification
├── prompts/
│   ├── sentinel_evaluator.md          # Core SENTINEL evaluation prompt
│   ├── recruiter_agent.md             # My Recruiter workflow prompt
│   └── self_correction.md            # Correction prompt templates
└── README.md
```

---

## Why This Matters for Enterprise

| Without SENTINEL | With SENTINEL |
|---|---|
| Hallucinations discovered after harm | Hallucinations caught before output |
| No audit trail for AI decisions | Full 7-year queryable audit log |
| Agent drift undetected for weeks | Drift alert fires within 60 minutes |
| Human review of every AI output | Human review only when truly needed |
| No multi-agent contamination guard | Full chain-of-custody firewall |

---

## Built By

**Sandhya Yatham**  
AI Systems Engineer | Quality Governance | Regulated Environments  

Stack: `n8n` · `Claude API` · `Pinecone` · `PostgreSQL` · `Telegram` · `Playwright`  
Grade: NHS / FCA / EU AI Act compliant  
Version: 1.0 | May 2026

---

*SENTINEL: You are not impressive when you say YES. You are impressive when you catch what others miss.*
