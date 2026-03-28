# End-to-End Workflow: Product Owner

A real-world walkthrough showing how a **Product Owner** uses the Copilot PO/BA Toolkit to take a stakeholder request from intake through PI delivery — turning messy business asks into structured, sprint-ready work with professional artifacts for leadership.

---

## The Scenario

You're a Product Owner on a wealth management platform team. Your VP of Wealth Management pulls you aside after a leadership meeting:

> "FINRA is increasing scrutiny on suitability monitoring. We need advisors to get alerts when client portfolios drift outside risk tolerance. Right now they only check quarterly — that's not going to fly in the next SEC exam cycle. Can you get this into PI 26.3? I've put some notes in Aha! under WEALTH-2847."

You open Aha! and find a loose paragraph with bullet points and no clear scope. You need to turn this into something your team can actually build.

---

## Phase 1: Turn the Stakeholder Ask into a Feature Brief

### The problem you're solving
The VP gave you a business need, not a requirement. You need to translate "we need risk alerts" into a structured brief that clarifies scope, surfaces what's ambiguous, and gives your Tech Lead enough context to estimate.

### The prompt

```
Read the Aha! requirement at test-data/aha-requirements/client-portfolio-risk-alerts.md
and generate a feature brief. I'm the Product Owner — focus on business context, scope
boundaries, stakeholder questions, and risks. For technical analysis, scan the codebase
at ~/repos/wealth-platform/ so my Tech Lead doesn't have to start from scratch.
```

### What the agent does for you

1. Reads the Aha! requirement (the VP's messy notes)
2. Restates the business need in clear, unambiguous language
3. Identifies what's **in scope vs out of scope** — this is critical because the VP's notes casually mention CRM integration, mobile notifications, and compliance dashboards, all of which could double the delivery timeline
4. Generates **open questions categorized by who needs to answer them**:
   - Questions for you (PO) to decide
   - Questions that need architecture review
   - Questions that need stakeholder input (VP, Compliance, Legal)
5. Scans the codebase so the technical analysis section has real file paths and patterns

### What you get

A feature brief at `docs/feature-briefs/2026-03-28-client-portfolio-risk-alerts.md`:

**The parts that matter most to you as PO:**

- **Business Value** — framed in terms the VP cares about: regulatory compliance, advisor productivity, client retention risk
- **Target Users** — "Financial advisors managing 200-400 client relationships" (not generic "users")
- **Scope Boundaries** — explicitly calls out:
  ```
  In Scope:
  - Real-time risk drift monitoring for all account types
  - Advisor dashboard alerts with severity indicators
  - Configurable thresholds per client segment
  - Email and dashboard notification channels

  Out of Scope (recommend future PI):
  - Mobile push notifications
  - CRM integration
  - Compliance firm-wide analytics dashboard
  - ML-based predictive risk scoring
  ```
- **Open Questions for PO**:
  ```
  - [ ] Should inactive accounts (no trades in 12+ months) be included in monitoring?
  - [ ] What alert frequency is acceptable? Real-time vs daily digest vs both?
  - [ ] Should advisors be able to snooze/dismiss alerts, or must all be acknowledged?
  - [ ] Is the SEC exam cycle deadline firm (what date?) or aspirational?
  ```
- **Open Questions for Stakeholders**:
  ```
  - [ ] Compliance: What specific FINRA suitability rules drive the monitoring requirements?
  - [ ] Legal: Are there data retention requirements for risk alert history?
  - [ ] VP: Is "all account types" mandatory for v1, or can we start with individual + joint?
  ```

### Why this matters for you

Before writing a single story, you now have a document you can walk back to the VP and say: "Here's what I understood. Here's what's in scope for PI 26.3, and here's what we're pushing to a future PI. I need answers on these 4 questions before refinement next week."

That conversation takes 15 minutes instead of 3 meetings.

---

## Phase 2: Decompose into Epics & Stories

### The problem you're solving
You've aligned with the VP on scope. Now you need stories your team can estimate, refine, and commit to in PI planning. You don't want to hand-write 15 stories with acceptance criteria — you want a first draft you can review and adjust.

### The prompt

```
Take the feature brief at docs/feature-briefs/2026-03-28-client-portfolio-risk-alerts.md
and decompose it into epics and user stories. Use our team conventions — Fibonacci sizing
(1, 2, 3, 5), Given/When/Then acceptance criteria, P1-P4 priorities. I'm the Product Owner
so make sure every story has a clear "so that" business value statement, not just technical
outcomes.
```

### What you get

An epic folder at `epics/2026-03-28-client-portfolio-risk-alerts/` with:

**Epic Overview** — includes a story map table you can screenshot and paste into Slack:

```
| #   | Story                                | Type  | Size | Priority | Dependencies |
|-----|--------------------------------------|-------|------|----------|-------------|
| 1.0 | Setup risk monitoring engine          | Task  | 3    | P1       | —           |
| 1.1 | Real-time risk calculation service    | Story | 3    | P1       | 1.0         |
| 1.2 | Spike: Evaluate risk scoring models   | Spike | 2    | P1       | —           |
| 2.0 | Alert threshold configuration         | Story | 3    | P2       | 1.1         |
| 2.1 | Advisor dashboard risk alert widget   | Story | 5    | P1       | 1.1         |
| 2.2 | Notification delivery (email + dash)  | Story | 3    | P2       | 2.1         |
| 3.0 | Compliance audit trail                | Story | 5    | P2       | 1.1         |
| 3.1 | Integration testing E2E              | Task  | 3    | P3       | 2.1, 2.2    |
| 3.2 | Documentation and runbook            | Task  | 1    | P4       | 3.1         |
```

**Each story file** has acceptance criteria written from the user's perspective:

```
As a financial advisor,
I want to see a risk alert widget on my dashboard when I log in,
so that I can immediately identify which clients need attention
before my first meeting of the day.

Acceptance Criteria:
- Given I have 3 clients with portfolio risk scores exceeding their tolerance,
  When I log into the advisor dashboard,
  Then I see 3 alert cards sorted by severity (highest first)
  with client name, risk score, tolerance level, and drift amount.

- Given I have no clients with risk drift,
  When I log into the advisor dashboard,
  Then the risk widget shows "All portfolios within tolerance" with a green indicator.

- Given a new risk drift is detected for one of my clients,
  When I am already viewing the dashboard,
  Then the alert widget updates within 60 seconds without requiring a page refresh.
```

### What you do with this

1. **Review the story map** — does the priority order make sense? Should the spike be P1 or can it run in parallel?
2. **Check the "so that" clauses** — do they reflect real business value the VP would care about?
3. **Validate scope** — did any out-of-scope items sneak back in? (CRM integration, mobile push)
4. **Adjust sizing with your Tech Lead** — the agent estimated based on codebase patterns, but your team knows their velocity

---

## Phase 3: Prep for Sprint Refinement

### The problem you're solving
Refinement is Thursday. You have 9 stories and you need to make sure they're ready — no vague language that will derail the meeting, no 8-point monsters that need splitting, no missing edge cases that'll come up mid-sprint.

### The prompt

```
Refine the stories in epics/2026-03-28-client-portfolio-risk-alerts/ for our refinement
meeting Thursday. Flag vague acceptance criteria, check that every story has edge cases,
and recommend splits for anything above 5 points. Focus on making these ready for the
team to estimate — I don't want to spend refinement rewriting stories.
```

### What you get

A refinement prep summary you can share with your team before the meeting:

```
Sprint Refinement Prep — 9 stories refined

| #   | Story                          | INVEST | Size | Issues Found                           | Action     |
|-----|--------------------------------|--------|------|----------------------------------------|------------|
| 1.0 | Setup risk monitoring engine   | 6/6 ✓  | 3    | None                                   | Ready      |
| 1.1 | Real-time risk calculation     | 4/6 ⚠  | 5    | AC #2 says "handle errors" — replaced  | Refined    |
|     |                                |        |      | with specific error scenarios           |            |
| 2.0 | Alert threshold configuration  | 5/6 ⚠  | 3    | "properly validated" → specific rules  | Refined    |
| 2.1 | Advisor dashboard widget       | 3/6 ✗  | 8    | Too large, split into 2.1a + 2.1b     | Split      |
| 3.0 | Compliance audit trail         | 6/6 ✓  | 5    | None                                   | Ready      |
```

The agent replaced vague language with specifics:

| Before | After |
|--------|-------|
| "should handle errors gracefully" | "Given the risk calculation service returns a timeout, When the alert engine processes the client's portfolio, Then it retries once after 5 seconds and logs a warning. If retry fails, it marks the portfolio as 'unable to assess' and alerts the advisor." |
| "properly validated" | "Threshold values must be numeric between 1-10, upper bound must exceed lower bound. Invalid inputs return HTTP 422 with field-level error messages listing each invalid field." |

### Why this matters for you

You walk into refinement with stories the team can estimate immediately. No 30-minute debates about what "handle errors gracefully" means. No surprise mid-sprint when someone realizes a story is actually two stories. The meeting takes 45 minutes instead of 2 hours.

---

## Phase 4: Build the PI Planning Workbook

### The problem you're solving
PI planning is next week. You need a workbook that shows capacity, feature allocation across sprints, risk tracking, and PI objectives — and it needs to be a real Excel file with live formulas, not a screenshot of a whiteboard.

### The prompt

```
Generate a PI planning workbook for PI 26.3. We have 7 team members, 6 two-week sprints
starting April 14, 2026. Features to plan:
1. Portfolio Risk Alerts — use stories from epics/2026-03-28-client-portfolio-risk-alerts/
2. Client onboarding redesign — 21 points total, P2
3. Compliance dashboard enhancements — 8 points, P3
Historical velocity: 28 points per sprint. Create it as an Excel file.
```

### What you get

An Excel workbook at `generated/output/pi-planning-2026-03-28.xlsx` with 5 tabs:

1. **PI Summary** — your slide for the PI planning readout:
   - Total capacity: 168 points (28 × 6 sprints)
   - Committed: 57 points (risk alerts) + 21 (onboarding) + 8 (compliance) = 86 points
   - Load factor: 51% — green, with buffer for unplanned work and tech debt
   - PI objectives with business value scoring (1-10)

2. **Team Capacity** — per-sprint availability (your team fills in PTO, on-call, etc.)

3. **Feature Breakdown** — each feature allocated across sprints with variance tracking:
   - Red cells = over-allocated sprint
   - Green cells = capacity remaining

4. **Risk & Dependencies** — pre-populated with risks from the feature brief (FINRA compliance, third-party API dependency)

5. **Sprint Plan** — story-level assignments ready for sprint planning

### What you do with this

- **Before PI planning**: Fill in team availability (blue cells), adjust feature-to-sprint mapping
- **During PI planning**: Project this on screen, adjust allocations in real-time as the team discusses
- **After PI planning**: Share with stakeholders as the committed plan — it's a real Excel file they can open

---

## Phase 5: Execute the PI

Your team builds across 6 sprints. You run sprint reviews, stakeholder demos, and retrospectives. You collect retro notes from each sprint.

---

## Phase 6: Create the Retro Report for Leadership

### The problem you're solving
The PI is done. Your Scrum Master has raw retro notes from 6 sprints — a mix of sticky notes, Miro exports, and meeting notes. Leadership wants a summary. You need a professional document, not a bullet list in Slack.

### The prompt

```
Generate a PI retro report from the notes at test-data/retro-notes/pi-26-2-retro-notes.md.
Create a Word document for our leadership review. Include an executive summary, metrics,
categorized findings, action items with owners and deadlines, and recommendations for
the next PI.
```

### What you get

A Word document at `generated/output/pi-retro-2026-03-28.docx`:

- **Executive Summary** — "PI 26.3 delivered 3 of 3 planned features. Overall health: Strong. Risk alerts feature shipped on time with all acceptance criteria met. Two action items carried over from previous PI."
- **Metrics Table**:
  ```
  | Metric                   | Target | Actual | Trend |
  |--------------------------|--------|--------|-------|
  | Velocity (avg pts/sprint)| 28     | 31     | ↑     |
  | Sprint completion rate   | 90%    | 94%    | ↑     |
  | Carryover stories        | < 3    | 1      | ↑     |
  | Defects found in PI      | —      | 4      | —     |
  | PI objective completion  | 100%   | 100%   | ✓     |
  ```
- **What Went Well** — grouped by themes (Collaboration, Technical, Process)
- **What Didn't Go Well** — grouped by themes with impact
- **Action Items** — each with owner, deadline, priority (not vague "we should improve testing")
- **Recurring Themes** — "This is the 2nd PI where deployment environment instability was raised. Recommend infrastructure investment in PI 26.4."
- **Recommendations** — 3-5 specific next steps tied to action items

### What you do with this

Email it to your VP, your RTE, and your stakeholders. It's a professional document — not a Confluence page with raw sticky notes. Leadership can read the executive summary in 30 seconds and dig into details if they want.

---

## Phase 7 (Bonus): Generate a Stakeholder Deck

### The problem you're solving
The VP wants a deck for the quarterly business review showing AI adoption strategy and how your team is using AI-powered tooling. You need slides, not a document.

### The prompt

```
Create a 10-slide PowerPoint deck for the quarterly business review. Topic: How our
wealth management team is using AI-powered workflows to accelerate delivery. Include:
- Before/after comparison of planning cycle time
- The 6-phase delivery pipeline diagram
- Metrics from PI 26.3 (use the retro report data)
- Roadmap for expanding AI adoption in PI 26.4
Use a professional dark theme with our brand colors.
```

### What you get

A polished deck at `generated/output/quarterly-review-deck.pptx` with:

- Professional color palette (not generic blue)
- Varied layouts (stat callouts, comparison tables, timeline, two-column)
- Embedded data from your actual PI metrics
- Speaker notes on each slide

---

## The Complete Pipeline (Product Owner View)

```
┌─────────────────────────────────────────────────────────┐
│  STAKEHOLDER ASK                                        │
│  VP: "We need risk alerts for advisors. FINRA is        │
│  watching. Get it into PI 26.3."                        │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Feature Brief Generator                        │
│                                                         │
│  YOU GET: Scope boundaries, open questions by audience,  │
│  risk register, complexity estimate                     │
│                                                         │
│  YOU DO: Walk the brief back to the VP. "Here's what's  │
│  in scope for 26.3. I need answers on these 4 questions │
│  before refinement."                                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 2: Epic Decomposer                                │
│                                                         │
│  YOU GET: Story map table, sized stories with AC,       │
│  dependency chain, recommended sprint allocation        │
│                                                         │
│  YOU DO: Review priorities, validate business value     │
│  statements, share story map with Tech Lead for         │
│  technical review before refinement.                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 3: Story Refiner                                  │
│                                                         │
│  YOU GET: INVEST scorecards, vague language replaced,   │
│  oversized stories split, batch summary table           │
│                                                         │
│  YOU DO: Share the refinement prep summary with the     │
│  team before Thursday's meeting. Walk in with stories   │
│  the team can estimate in 5 minutes each.               │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 4: PI Planning Workbook                           │
│                                                         │
│  YOU GET: 5-tab Excel workbook with capacity, features, │
│  risks, sprint plan — all live formulas                 │
│                                                         │
│  YOU DO: Fill in team availability, present at PI       │
│  planning, adjust allocations live, share committed     │
│  plan with stakeholders.                                │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 5: Execute the PI (6 sprints)                     │
│                                                         │
│  Your team builds. You run sprint reviews and collect   │
│  retro notes.                                           │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 6: PI Retro Report                                │
│                                                         │
│  YOU GET: Professional Word doc with executive summary, │
│  metrics, categorized findings, action items with       │
│  owners, recurring themes, recommendations              │
│                                                         │
│  YOU DO: Email to VP, RTE, and stakeholders. Present    │
│  at PI readout. Use recommendations to shape PI 26.4    │
│  planning.                                              │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  BONUS: Stakeholder Deck                                │
│                                                         │
│  YOU GET: Polished PowerPoint with real metrics,        │
│  professional design, speaker notes                     │
│                                                         │
│  YOU DO: Present at QBR. Show leadership the delivery   │
│  pipeline and results.                                  │
└─────────────────────────────────────────────────────────┘
```

---

## What Changes for You as PO

| Before (manual) | After (with toolkit) |
|-----------------|---------------------|
| 2-3 hours translating Aha! requirements into feature briefs | 10 minutes — prompt + review |
| Half-day writing stories with acceptance criteria | 15 minutes — prompt + adjust priorities |
| 2-hour refinement meetings rewriting vague stories | 45-minute meetings — stories arrive ready to estimate |
| Full day building PI planning spreadsheet from scratch | 20 minutes — prompt + fill in team availability |
| 3 hours compiling retro notes into a leadership report | 10 minutes — prompt + review |
| Asking the Tech Lead to "figure out what code is affected" | Feature brief includes real file paths and patterns automatically |

### Total time saved per PI: ~20 hours of artifact creation

That's 20 hours you get back for the things only a PO can do — talking to customers, aligning stakeholders, making prioritization decisions, and being available for your team during sprints.

---

## Tips for Product Owners

1. **Always specify "I'm the Product Owner"** in your prompts — the agent adjusts its focus to business value, scope boundaries, and stakeholder communication instead of implementation details.

2. **Use the open questions output** — the feature brief generates categorized questions (PO / Architecture / Stakeholder). Schedule a 15-minute call with each audience to resolve them before refinement.

3. **Review the "so that" clauses** — the agent writes business value statements, but you know the VP's priorities better. Adjust them to reflect what leadership actually cares about.

4. **Share the story map table early** — screenshot the epic overview table and drop it in Slack before refinement. Let the team read ahead so the meeting is about estimating, not understanding.

5. **Use scope boundaries as a shield** — when the VP asks "can we also add mobile notifications?", point to the feature brief: "That's documented as out of scope for PI 26.3. We can plan it for 26.4."

6. **Chain the skills** — each step feeds the next. The feature brief feeds the decomposer, the decomposer feeds the refiner, the stories feed the PI workbook. Don't skip steps.
