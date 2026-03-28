# End-to-End Workflow: From Aha! Requirement to Delivery

A real-world walkthrough showing how a **Tech Lead** uses the Copilot PO/BA Toolkit against an existing codebase to take a vague business requirement all the way through planning, refinement, and retrospective.

---

## The Scenario

You're a Tech Lead on a wealth management platform team. Your PO drops a link to an Aha! requirement in Slack:

> "WEALTH-2847 — Real-Time Portfolio Risk Alerts. VP wants advisors to get alerted when client portfolios drift outside risk tolerance. High priority, regulatory driver. Can you take a look and figure out what it would take?"

Your codebase is a monorepo at `~/repos/wealth-platform/` with services for portfolio management, client profiles, notifications, and compliance reporting.

---

## Phase 1: Understand the Requirement → Feature Brief

### What you're doing
Taking the vague Aha! requirement and generating a structured feature brief that includes **real technical analysis from your codebase** — not generic boilerplate.

### The prompt

```
Read the Aha! requirement at test-data/aha-requirements/client-portfolio-risk-alerts.md
and generate a feature brief. Analyze the codebase at ~/repos/wealth-platform/ for
technical context — look at the portfolio service, notification service, and any existing
risk calculation logic.
```

### What happens behind the scenes

1. The agent reads the Aha! requirement file
2. It **scans your actual codebase** — searching for:
   - Portfolio-related services and APIs
   - Existing risk calculation logic or models
   - Notification infrastructure (email, push, webhooks)
   - Database schemas for portfolios, clients, risk profiles
   - Existing patterns (controllers, services, repositories)
3. It produces a feature brief with **real file paths and patterns from your code**

### What you get

A feature brief saved to `docs/feature-briefs/2026-03-28-client-portfolio-risk-alerts.md` containing:

- **Business Context** — the vague requirement restated clearly with ambiguity removed
- **Technical Analysis** — a table of affected services with actual file paths:
  ```
  | System/Service        | Type of Change | Complexity |
  |----------------------|---------------|------------|
  | portfolio-service     | Modify        | L          |
  | notification-service  | Modify        | M          |
  | compliance-reporting  | New module    | M          |
  | client-profile-api    | Modify        | S          |
  ```
- **Key Files** pulled from your codebase:
  ```
  - src/services/portfolio/risk-calculator.ts — existing basic risk scoring, needs real-time extension
  - src/services/notifications/channels/ — email and SMS channels exist, need push notification channel
  - src/models/client-profile.ts — has riskTolerance field but no threshold configuration
  - src/controllers/portfolio.controller.ts — follows BaseController pattern, new endpoints go here
  ```
- **Existing Patterns** — e.g., "All services use the repository pattern in `src/repositories/`"
- **Risks** — "FINRA suitability requirements need legal review before AC finalization"
- **Open Questions** — categorized by who needs to answer (PO, Architecture, Stakeholders)
- **Complexity Estimate** — L, with reasoning

### Why this matters

Without the toolkit, you'd spend 2-3 hours reading the Aha! requirement, digging through the codebase, writing up a brief in Confluence, and going back and forth with the PO on scope. The agent does the codebase analysis for you and surfaces what matters.

---

## Phase 2: Decompose into Epics & Stories

### What you're doing
Taking the feature brief and breaking it into sprint-ready user stories with acceptance criteria, sizing, dependencies, and technical notes — all referencing your actual codebase.

### The prompt

```
Take the feature brief at docs/feature-briefs/2026-03-28-client-portfolio-risk-alerts.md
and decompose it into epics and user stories. Use our team conventions (Fibonacci sizing
1/2/3/5, Given/When/Then acceptance criteria, P1-P4 priorities). Reference the codebase
at ~/repos/wealth-platform/ for technical notes in each story.
```

### What you get

An epic folder at `epics/2026-03-28-client-portfolio-risk-alerts/`:

```
epics/2026-03-28-client-portfolio-risk-alerts/
├── epic-overview.md
├── 1.0-setup-risk-monitoring-engine.md
├── 1.1-real-time-risk-calculation-service.md
├── 1.2-spike-evaluate-risk-scoring-models.md
├── 2.0-alert-threshold-configuration.md
├── 2.1-advisor-dashboard-risk-widget.md
├── 2.2-notification-delivery-channels.md
├── 3.0-compliance-reporting-module.md
├── 3.1-integration-testing-e2e.md
└── 3.2-documentation-and-runbook.md
```

Each story file includes:

- **User Story** — "As a financial advisor, I want to receive real-time alerts when a client's portfolio risk score exceeds their stated tolerance, so that I can take corrective action before regulatory thresholds are breached."
- **Acceptance Criteria** in Given/When/Then:
  ```
  - Given a client has a risk tolerance of "Moderate" (score 4-6),
    When their portfolio risk score exceeds 7,
    Then the advisor receives an alert within 5 minutes via dashboard notification and email.
  ```
- **Edge Cases** — "Portfolio with 0 holdings", "Client with no risk tolerance set", "Advisor managing 400+ clients receives bulk alerts"
- **Technical Notes** — referencing real files:
  ```
  - Affected files: src/services/portfolio/risk-calculator.ts, src/models/alert-threshold.ts (new)
  - Patterns to follow: Use the EventEmitter pattern from src/events/ for alert publishing
  - API changes: New POST /api/v1/alerts/thresholds endpoint on portfolio-service
  ```
- **Size** — 3 (modifies existing risk calculator, adds threshold logic, follows established patterns)
- **Dependencies** — "Blocked by: 1.2 (spike must resolve before implementation)"

The **epic-overview.md** includes a story map table, total point count, critical path analysis, and recommended sprint allocation.

---

## Phase 3: Refine Stories for Sprint Refinement

### What you're doing
Before your team's refinement meeting, you run the stories through the refiner to catch vague language, missing edge cases, and stories that need splitting.

### The prompt

```
Refine the stories in epics/2026-03-28-client-portfolio-risk-alerts/ for our refinement
meeting next Tuesday. Flag anything vague, recommend splits for stories above 5 points,
and check against the codebase at ~/repos/wealth-platform/ for technical feasibility.
```

### What you get

A batch refinement summary:

```
Sprint Refinement Prep — 9 stories refined

| #   | Story                          | INVEST | Size | Issues Found                           | Action     |
|-----|--------------------------------|--------|------|----------------------------------------|------------|
| 1.0 | Setup risk monitoring engine   | 6/6 ✓  | 3    | None                                   | Ready      |
| 1.1 | Real-time risk calculation     | 4/6 ⚠  | 5    | AC #2 not testable, missing error case | Refined    |
| 1.2 | Spike: risk scoring models     | 6/6 ✓  | 2    | None                                   | Ready      |
| 2.0 | Alert threshold configuration  | 5/6 ⚠  | 3    | "properly validated" is vague          | Refined    |
| 2.1 | Advisor dashboard widget       | 3/6 ✗  | 8    | Too large, no edge cases               | Split → 2.1a + 2.1b |
| 2.2 | Notification delivery          | 5/6 ⚠  | 5    | Missing mobile push edge case          | Refined    |
| 3.0 | Compliance reporting module    | 6/6 ✓  | 5    | None                                   | Ready      |
| 3.1 | Integration testing E2E        | 6/6 ✓  | 3    | None                                   | Ready      |
| 3.2 | Documentation and runbook      | 6/6 ✓  | 1    | None                                   | Ready      |
```

For story 2.1 (dashboard widget at 8 points), the refiner recommends:

```
⚠ Story 2.1 estimated at 8 points. Recommend splitting:

1. "Advisor dashboard — risk alert widget" (3 pts)
   - Display risk alerts in dashboard grid with severity indicators
   - AC: Given advisor logs in, When 3 clients have risk drift, Then widget shows 3 alert cards sorted by severity

2. "Advisor dashboard — alert detail and actions" (5 pts)
   - Click-through to full alert detail with acknowledge/dismiss/escalate actions
   - AC: Given advisor clicks an alert card, When the detail panel opens, Then they see portfolio breakdown, risk score history chart, and action buttons
```

For vague language, it replaces:
- "properly validated" → "Threshold values must be numeric, between 1-10, and the upper bound must exceed the lower bound. Invalid inputs return HTTP 422 with field-level error messages."

---

## Phase 4: Plan the PI

### What you're doing
Generating a PI Planning workbook that maps your stories to sprints with capacity tracking, risk management, and cross-team dependencies.

### The prompt

```
Generate a PI planning workbook for PI 26.3. We have 7 team members, 6 two-week sprints
starting April 14 2026. Use the stories from epics/2026-03-28-client-portfolio-risk-alerts/
plus these other features the PO added:
- WEALTH-2901: Client onboarding workflow redesign (already decomposed, 21 points)
- WEALTH-2855: Compliance dashboard enhancements (8 points)
Historical velocity: 28 points/sprint.
```

### What you get

An Excel workbook at `generated/output/pi-planning-2026-03-28.xlsx` with 5 sheets:

1. **PI Summary** — KPI cards showing total capacity vs committed points, load factor with conditional formatting (green/yellow/red), PI objectives with business value scoring
2. **Team Capacity** — 7 team members x 6 sprints with availability percentages, capacity formulas, frozen panes
3. **Feature Breakdown** — all features mapped to sprints with variance tracking (red = over-allocated)
4. **Risk & Dependencies** — ROAM matrix with the risks from your feature brief pre-populated
5. **Sprint Plan** — story-level assignments per sprint with capacity tracking

All calculations are **live Excel formulas**. Blue font = cells your team fills in. Black font = formulas that auto-calculate.

---

## Phase 5: Execute the PI

This is where your team does the actual work across 6 sprints. The toolkit isn't involved here — your team writes code, runs sprints, and delivers.

---

## Phase 6: Generate the Retro Report

### What you're doing
After the PI, your Scrum Master has a pile of retro notes from 6 sprint retros. You turn them into a professional report for leadership.

### The prompt

```
Generate a PI retro report from the notes at test-data/retro-notes/pi-26-2-retro-notes.md.
Create a Word document with categorized findings, metrics summary, action items with owners
and deadlines, and recommendations for next PI.
```

### What you get

A Word document at `generated/output/pi-retro-2026-03-28.docx` with:

- **Executive Summary** — 3 wins, 3 concerns, overall health rating
- **Metrics Table** — velocity, completion rate, defects, carryover with trend indicators
- **What Went Well** — grouped by themes (Collaboration, Technical, Process)
- **What Didn't Go Well** — grouped by themes with impact descriptions
- **Action Items** — each with an owner, deadline, and priority
- **Recurring Themes** — "This is the 2nd PI where deployment reliability was raised"
- **Recommendations** — tied to action items

---

## The Complete Pipeline

```
┌─────────────────────────────────────────────────────────┐
│  Aha! Requirement (vague, 1 paragraph)                  │
│  "We need risk alerts for advisors..."                  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Feature Brief Generator                        │
│                                                         │
│  Prompt: "Read the Aha! requirement and generate a      │
│  feature brief. Analyze the codebase at ~/repos/        │
│  wealth-platform/ for technical context."               │
│                                                         │
│  Output: docs/feature-briefs/YYYY-MM-DD-feature.md      │
│  (real file paths, patterns, risks, open questions)     │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 2: Epic Decomposer                                │
│                                                         │
│  Prompt: "Decompose the feature brief into epics and    │
│  user stories. Use our team conventions. Reference the  │
│  codebase for technical notes."                         │
│                                                         │
│  Output: epics/YYYY-MM-DD-feature/                      │
│  (epic overview + numbered story files with AC,         │
│   sizing, dependencies, technical notes)                │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 3: Story Refiner                                  │
│                                                         │
│  Prompt: "Refine the stories in the epic folder for     │
│  our refinement meeting. Flag vague language, add edge  │
│  cases, recommend splits for anything above 5 points."  │
│                                                         │
│  Output: Refined stories + batch summary table          │
│  (INVEST scorecards, vague language replaced,           │
│   oversized stories split with reasoning)               │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 4: PI Planning Workbook                           │
│                                                         │
│  Prompt: "Generate a PI planning workbook for PI 26.3.  │
│  7 team members, 6 sprints. Use the stories from the    │
│  epic folder. Historical velocity: 28 pts/sprint."      │
│                                                         │
│  Output: generated/output/pi-planning-YYYY-MM-DD.xlsx   │
│  (5 sheets: summary, capacity, features, risks, plan)   │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 5: Execute the PI                                 │
│                                                         │
│  Your team builds the feature across 6 sprints.         │
│  (The toolkit is not involved here — this is real work) │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 6: PI Retro Report                                │
│                                                         │
│  Prompt: "Generate a PI retro report from the notes at  │
│  retro-notes/pi-26-3-retro.md. Create a Word document   │
│  with findings, metrics, action items, and recs."       │
│                                                         │
│  Output: generated/output/pi-retro-YYYY-MM-DD.docx      │
│  (executive summary, categorized findings, action items │
│   with owners, recurring themes, recommendations)       │
└─────────────────────────────────────────────────────────┘
```

---

## Key Takeaway: The Codebase Connection

The critical difference between this toolkit and generic AI document generation is **Step 1 and Step 2 analyze your actual codebase**. When the Tech Lead points the agent at `~/repos/wealth-platform/`, the feature brief and stories contain:

- Real file paths (`src/services/portfolio/risk-calculator.ts`)
- Real patterns (`follows BaseController in src/controllers/`)
- Real architecture context (`notification-service uses EventEmitter pattern`)
- Real risks (`existing risk-calculator.ts only supports batch mode, needs real-time extension`)

This means your stories arrive at refinement with technical context already embedded — the team isn't starting from scratch trying to figure out what code is affected.

---

## Tools That Work With This Workflow

| Tool | How |
|------|-----|
| **GitHub Copilot CLI** | Run prompts in your terminal against your codebase |
| **Claude Code** | Run prompts with full codebase access and file generation |
| **VS Code Agent Mode** | Run prompts inside your editor with workspace context |
| **Jira MCP** | Read/write Jira tickets directly (skip copy-paste) |
| **ClickUp MCP** | Push epic folders to ClickUp as task lists |
