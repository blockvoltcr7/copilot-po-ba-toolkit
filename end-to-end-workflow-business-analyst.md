# End-to-End Workflow: Business Analyst

A real-world walkthrough showing how a **Business Analyst** uses the Copilot PO/BA Toolkit to support the Product Owner — translating stakeholder conversations into structured artifacts, running refinement prep, building planning workbooks, and producing reports that communicate clearly across technical and business audiences.

**Key difference from the Tech Lead workflow**: You're not pointing the agent at a codebase. You're working with **business requirements, stakeholder notes, meeting transcripts, and process documentation**. The toolkit is your artifact factory — you feed it messy inputs and get structured, professional outputs.

---

## The Scenario

You're a Business Analyst embedded in a wealth management platform team. Your Product Owner just got out of a meeting with the VP of Wealth Management and pings you on Slack:

> "Hey — the VP wants real-time risk alerts for advisors. Regulatory driver. I put rough notes in Aha! (WEALTH-2847) but they're messy. Can you clean this up and get it ready for the team? I need a feature brief by Wednesday, stories by Thursday refinement, and a PI planning workbook by next Monday."

You open Aha! and find a paragraph with scattered bullet points, no clear scope, and several "it would be nice if" items mixed in with hard regulatory requirements. This is your day.

---

## Phase 1: Research & Structure the Requirement

### The problem you're solving
The PO handed you raw stakeholder notes. Before you can generate a feature brief, you need to separate the hard requirements from the wish list, identify who needs to answer open questions, and understand the regulatory context well enough to write acceptance criteria later.

### Step 1a: Organize your research

Before touching the toolkit, do what BAs do best — gather context:

- Read the Aha! requirement
- Check Confluence/SharePoint for any existing documentation on risk monitoring
- Review FINRA suitability rules referenced in the requirement
- Talk to the compliance team: "What specifically does FINRA require for suitability monitoring?"
- Talk to 1-2 advisors: "How do you check portfolio risk today? What's painful?"

### Step 1b: Generate the feature brief

Now you have enough context to give the agent a rich prompt. Unlike the Tech Lead who points at a codebase, you feed in **business context you gathered**.

### The prompt

```
Generate a feature brief from the requirement at
test-data/aha-requirements/client-portfolio-risk-alerts.md.

Additional context I gathered from stakeholders:

- Compliance confirmed FINRA Rule 2111 (Suitability) requires firms to have
  "reasonable basis" for believing recommendations are suitable. Automated
  monitoring strengthens this position during SEC exams.
- Advisors currently check risk in PortfolioView (the existing desktop tool)
  by running a manual report — takes ~15 minutes per client. With 300 clients
  average, they only review quarterly.
- The VP's hard requirements are: automated monitoring, advisor alerts, and
  audit trail for compliance. Everything else (CRM integration, mobile push,
  ML scoring) is a "nice to have" for a future PI.
- The compliance team needs a quarterly export of all alerts and advisor
  responses for their SEC exam binder.
- There's an existing client risk profile in the system — each client has a
  risk tolerance score (1-10) set during onboarding.

Focus on business context, scope boundaries, and open questions. Flag anything
that needs PO or stakeholder decision before the team can estimate.
```

### What you get

A feature brief at `docs/feature-briefs/2026-03-28-client-portfolio-risk-alerts.md` that's sharper than what you'd get from the raw Aha! notes alone, because you enriched the prompt with your research:

**Business Context** — clearly separates the regulatory driver (FINRA 2111) from the user experience improvement (advisor productivity), so the PO can prioritize accordingly.

**Scope Boundaries** — the agent picked up your "hard requirements vs nice to have" distinction:
```
In Scope (PI 26.3):
- Automated daily risk drift monitoring against client risk tolerance
- Advisor dashboard alerts with severity indicators
- Configurable alert thresholds per client segment
- Email + dashboard notification channels
- Compliance audit trail with quarterly export capability

Out of Scope (Future PI):
- Mobile push notifications
- CRM integration (Salesforce)
- ML-based predictive risk scoring
- Firm-wide compliance analytics dashboard
```

**Open Questions** — categorized by audience, ready for you to schedule 15-minute calls:
```
Needs PO Decision:
- [ ] Should monitoring run daily or intra-day? Daily is simpler and covers
      the regulatory need; intra-day adds complexity but catches rapid market moves.
- [ ] Should advisors be required to acknowledge every alert, or only High severity?

Needs Compliance Input:
- [ ] What retention period is required for alert history? (7 years for SEC?)
- [ ] Does the quarterly export need to include advisor response timestamps?

Needs Stakeholder Alignment:
- [ ] VP mentioned "all account types" — confirm this includes 401k rollovers,
      which have different suitability rules under DOL fiduciary standard.
```

### What you do with this

1. **Send the brief to your PO** — "Here's the structured brief. I highlighted 3 PO decisions we need before Thursday. Can you review tonight?"
2. **Schedule a 15-minute call with Compliance** — walk through the compliance questions with the brief on screen
3. **Update the brief** with answers as they come in — the brief becomes your single source of truth

---

## Phase 2: Decompose into Stories

### The problem you're solving
The PO approved the scope. Now you need stories the team can estimate at Thursday's refinement. You write the first draft — the Tech Lead will add technical notes after.

### The prompt

```
Take the feature brief at docs/feature-briefs/2026-03-28-client-portfolio-risk-alerts.md
and decompose it into epics and user stories.

Team conventions:
- Sizing: Fibonacci 1, 2, 3, 5 only (split anything above 5)
- Acceptance criteria: Given / When / Then format
- Priorities: P1 (critical) through P4 (low)
- Sprint length: 2 weeks

I'm the Business Analyst — write the stories from the user's perspective (financial
advisors and compliance officers), not from a technical perspective. The Tech Lead will
add implementation details later. Focus on business behavior, user workflows, and
acceptance criteria that can be verified during UAT.
```

### What you get

An epic folder with stories written in business language:

**Story 2.0 — Alert Threshold Configuration:**
```
As a financial advisor,
I want to configure risk alert thresholds for different client segments
(conservative, moderate, aggressive),
so that I receive alerts calibrated to each client's investment profile
rather than a one-size-fits-all threshold.

Acceptance Criteria:
- Given I navigate to the alert settings page,
  When I select the "Conservative" client segment,
  Then I can set the risk drift threshold between 1-10
  with a default of 2 (tight tolerance).

- Given I set a threshold of 3 for "Moderate" clients,
  When a Moderate client's portfolio risk score exceeds their
  tolerance by 3 or more points,
  Then I receive an alert within the configured notification window.

- Given I have not configured custom thresholds,
  When the system monitors my clients,
  Then it uses the firm-wide default thresholds set by compliance.

Edge Cases:
- Advisor sets upper and lower threshold to the same value (should be rejected)
- Client's risk tolerance is updated mid-monitoring cycle — alert thresholds
  should recalculate on next monitoring run
- New client onboarded with no risk tolerance score — system should flag for
  advisor to complete risk profiling, not generate false alerts
```

**Story 3.0 — Compliance Audit Trail:**
```
As a compliance officer,
I want a complete audit trail of all risk alerts and advisor responses,
so that I can produce evidence of proactive suitability monitoring
during SEC examinations.

Acceptance Criteria:
- Given a risk alert was generated for a client on March 15,
  When I run the quarterly compliance export for Q1,
  Then the export includes: alert date, client ID, risk score,
  tolerance score, drift amount, advisor name, response action,
  and response timestamp.

- Given an advisor acknowledged an alert and documented their action,
  When I view the alert history for that client,
  Then I can see the advisor's response notes and the date they responded.

- Given an advisor has not responded to a High severity alert within 48 hours,
  When I view the unacknowledged alerts report,
  Then that alert appears with a "Past Due" flag and days overdue count.
```

### Why your version is different from the Tech Lead's

Notice these stories say nothing about API endpoints, database schemas, or service architecture. They describe **business behavior that can be verified during UAT**. Your Tech Lead will add a `Technical Notes` section to each story with affected files and patterns — but the acceptance criteria are yours. You own the "what," they own the "how."

### What you do with this

1. **Review every "so that" clause** — does it reflect what the VP and advisors actually care about?
2. **Walk the stories past your PO** — quick gut check on priorities before refinement
3. **Send the story map to the Tech Lead** — "Here are the stories. Can you add technical notes before Thursday? I left the Technical Notes section blank for you."
4. **Forward compliance-related stories (3.0) to the compliance team** — "Does this audit trail match what you need for the SEC exam binder?"

---

## Phase 3: Refine Stories Before the Meeting

### The problem you're solving
It's Wednesday afternoon. Refinement is tomorrow at 10am. You want to make sure every story is tight — no vague language that will start a 20-minute debate, no missing edge cases that'll surface mid-sprint as a bug.

### The prompt

```
Refine the stories in epics/2026-03-28-client-portfolio-risk-alerts/ for tomorrow's
refinement meeting. Run an INVEST check on each story. Replace any vague language with
specific, testable criteria. Add edge cases we might have missed. Recommend splits for
anything above 5 points.

Focus on making acceptance criteria UAT-ready — a QA analyst should be able to read
each Given/When/Then and write a test case directly from it without asking questions.
```

### What you get

The agent catches things you might miss at 4pm on a Wednesday:

**Vague language replaced:**

| Before | After |
|--------|-------|
| "alerts should be timely" | "alerts delivered within 5 minutes of risk drift detection for High severity, within 60 minutes for Medium severity" |
| "system should handle edge cases" | Three specific edge cases added: portfolio with 0 holdings, client with risk tolerance under review, advisor on PTO with backup advisor assigned |
| "export should include relevant data" | Explicit column list: alert_date, client_id, client_name, portfolio_id, risk_score, tolerance_score, drift_amount, severity, advisor_id, advisor_name, response_action, response_timestamp, response_notes |

**Missing edge cases surfaced:**

```
Story 2.1 (Dashboard Widget) — added:
- Advisor is assigned as backup for a colleague on PTO — should they see
  the colleague's client alerts? (Flag as open question for PO)
- Dashboard session has been open for 8+ hours — alerts should still
  refresh without requiring logout/login
- Browser notification permissions denied — alert should still appear
  in-dashboard even if browser push is blocked

Story 3.0 (Compliance Audit Trail) — added:
- Quarterly export spans a period where alert thresholds were changed
  mid-quarter — export should show which threshold was active at the
  time of each alert
- Client was transferred between advisors mid-quarter — both advisors'
  responses should appear in the export
```

**Split recommendation:**

```
⚠ Story 2.1 "Advisor dashboard risk alert widget" estimated at 8 points.
Recommend splitting:

2.1a — "Dashboard alert widget — display and sorting" (3 pts)
  - Show alert cards on dashboard, sorted by severity
  - Refresh on page load
  - AC: display, sorting, empty state

2.1b — "Dashboard alert widget — real-time updates and actions" (5 pts)
  - Live refresh without page reload
  - Acknowledge, dismiss, escalate actions
  - AC: real-time update, action workflows, confirmation states
```

### What you do with this

1. **Review the new edge cases** — are they realistic? Some might be over-engineered for v1
2. **Resolve the open questions the agent flagged** — ping the PO on the backup advisor question before tomorrow
3. **Share the refinement prep summary** in the team Slack channel with a note: "Stories for tomorrow's refinement attached. Pre-read appreciated — I want to keep us under an hour."

---

## Phase 4: Build the PI Planning Workbook

### The problem you're solving
PI planning is Monday. The PO asked you to build the planning workbook. You need capacity tracking, feature-to-sprint mapping, and a risk register — and it needs to be a real spreadsheet the RTE can project on screen during the planning session.

### The prompt

```
Generate a PI planning workbook for PI 26.3.

Team details:
- 7 team members: Sarah (PO, 20% capacity), Mike (Tech Lead), Priya (Senior Dev),
  James (Dev), Lin (Dev), Ahmed (QA), you (BA, 30% capacity for testing support)
- Mike is on PTO Sprint 3, Ahmed is on PTO Sprint 5
- 6 two-week sprints starting April 14, 2026
- Historical velocity: 28 points per sprint

Features to plan:
1. Portfolio Risk Alerts — stories from epics/2026-03-28-client-portfolio-risk-alerts/
   (approximately 30 points after splitting, P1)
2. Client onboarding workflow redesign — 21 points, P2
3. Compliance dashboard enhancements — 8 points, P3
4. Tech debt: upgrade notification service framework — 5 points, P3

Risks to pre-populate:
- FINRA regulatory deadline is a hard constraint — risk alerts must ship by end of PI
- Compliance team availability for UAT is limited to Sprints 4-5
- Third-party market data API contract renewal pending (dependency for risk scoring)
```

### What you get

An Excel workbook at `generated/output/pi-planning-2026-03-28.xlsx`:

- **Team Capacity sheet** — Mike's Sprint 3 and Ahmed's Sprint 5 already show reduced availability. Capacity formulas auto-adjust.
- **Feature Breakdown sheet** — risk alerts (P1) front-loaded in Sprints 1-4, compliance UAT aligned with compliance team availability in Sprints 4-5
- **Risk & Dependencies sheet** — your 3 risks pre-populated with ROAM status dropdowns
- **PI Summary** — load factor calculated, PI objectives ready for business value scoring

### What you do with this

1. **Review with the PO** — "Here's the draft workbook. Load factor is 52% which gives us buffer. Risk alerts are front-loaded to hit the regulatory deadline. Does this allocation look right?"
2. **Print the Risk sheet** before PI planning — walk through risks with the RTE
3. **During PI planning** — update the workbook live as the team adjusts allocations
4. **After PI planning** — email the final workbook to stakeholders as the committed plan

---

## Phase 5: Create Artifacts During the PI

### What BAs do during execution that the toolkit helps with

While the team builds, you're not idle. Here's how the toolkit supports your day-to-day:

### 5a: Stakeholder Status Reports

Your VP wants a weekly status update. Instead of manually writing a report each Friday:

```
Create a Word document for the weekly status report. PI 26.3, Sprint 2 of 6.

Status:
- Risk alerts feature: On track. Stories 1.0 and 1.1 complete, 1.2 spike
  findings presented — team chose Option B (threshold-based scoring).
- Onboarding redesign: On track. Design review complete, dev starts Sprint 3.
- Compliance dashboard: Not started (planned for Sprint 4).

Risks:
- Market data API contract still unsigned. Escalated to VP. If not resolved
  by Sprint 3, we fall back to batch data (daily instead of real-time).

Decisions needed:
- PO to confirm: Should alert thresholds be advisor-configurable or
  compliance-controlled? Needed by end of Sprint 3.

Format: Executive summary at top, details below. Professional styling.
Keep it to 1 page.
```

You get a polished Word doc you can email or attach to a Confluence page.

### 5b: Refining New Stories Mid-PI

The compliance team comes back with a new requirement mid-PI: "We also need an annual suitability review report, not just quarterly." You need a quick story:

```
Refine this draft story for our backlog:

"As a compliance officer, I want an annual suitability review report that aggregates
all quarterly risk alert data into a yearly summary with trend analysis, so that I
can include it in the firm's annual compliance filing."

Check it against INVEST criteria, add Given/When/Then acceptance criteria, and flag
if this should be in the current PI or deferred.
```

The agent writes the acceptance criteria, flags that it's a 5-point story that would need to be squeezed into Sprint 5-6, and recommends deferring to PI 26.4 unless the compliance deadline requires it — giving you a clear recommendation to bring to the PO.

### 5c: UAT Test Scenarios

When the feature is ready for UAT in Sprint 4, you need test scenarios for the compliance team to execute:

```
Generate UAT test scenarios for the stories in
epics/2026-03-28-client-portfolio-risk-alerts/. Format as a Word document
with scenario name, preconditions, steps, and expected results. The compliance
team will execute these — use business language, not technical jargon.
Group by user persona (advisor scenarios vs compliance officer scenarios).
```

You get a structured UAT document you can hand directly to the compliance team.

---

## Phase 6: PI Retrospective Report

### The problem you're solving
PI 26.3 is done. The Scrum Master ran retros each sprint and dumped the notes in a shared doc. The RTE needs a report for the PI readout. Your PO asks you to compile it.

### The prompt

```
Generate a PI retro report from the notes at test-data/retro-notes/pi-26-2-retro-notes.md.
Create a Word document for the PI readout.

Additional context:
- This is PI 26.3 (the retro notes file is from a previous PI, use it as a template
  for the format)
- Team delivered 3 of 3 planned features on time
- Velocity increased from 28 to 31 points/sprint average
- One carryover story (annual compliance report — intentionally deferred)
- The market data API contract issue was resolved in Sprint 3 after VP escalation

Highlight wins for the team — they worked hard this PI and I want leadership to see that.
Keep the "what didn't go well" section constructive with specific action items.
```

### What you get

A professional Word document the RTE can present at the PI readout. The executive summary leads with wins (3/3 features, velocity increase, zero critical defects), the metrics table shows trend arrows, and every action item has an owner and deadline — not vague "we should improve."

---

## The Complete Pipeline (Business Analyst View)

```
┌─────────────────────────────────────────────────────────┐
│  STAKEHOLDER INPUT (messy)                              │
│  Aha! notes, meeting transcripts, Slack threads,        │
│  compliance requirements, advisor interviews            │
└──────────────────────────┬──────────────────────────────┘
                           │
                    BA gathers context,
                    talks to stakeholders,
                    identifies open questions
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Feature Brief Generator                        │
│                                                         │
│  INPUT: Aha! requirement + your stakeholder research    │
│  OUTPUT: Structured brief with scope, risks, questions  │
│                                                         │
│  YOU DO: Send to PO for approval. Schedule calls to     │
│  resolve open questions. Update brief with answers.     │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 2: Epic Decomposer                                │
│                                                         │
│  INPUT: Approved feature brief                          │
│  OUTPUT: Story map + story files with Given/When/Then   │
│                                                         │
│  YOU DO: Review stories for business accuracy. Send to  │
│  Tech Lead to add technical notes. Share story map      │
│  with PO for priority check.                            │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 3: Story Refiner                                  │
│                                                         │
│  INPUT: Stories from epic folder                        │
│  OUTPUT: INVEST scorecards, vague language fixed,       │
│          edge cases added, splits recommended           │
│                                                         │
│  YOU DO: Share refinement prep in Slack. Resolve open   │
│  questions before the meeting. Run a 45-minute          │
│  refinement instead of a 2-hour one.                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 4: PI Planning Workbook                           │
│                                                         │
│  INPUT: Stories + team details + velocity + risks       │
│  OUTPUT: 5-tab Excel workbook with live formulas        │
│                                                         │
│  YOU DO: Review with PO, present at PI planning,        │
│  update live during the session, distribute final plan. │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 5: During the PI                                  │
│                                                         │
│  Generate as needed:                                    │
│  • Weekly status reports (Word docs)                    │
│  • Mid-PI story refinement for new requirements         │
│  • UAT test scenarios for compliance/business testers   │
│  • Stakeholder presentations (PowerPoint decks)         │
│  • Data analysis workbooks (Excel)                      │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 6: PI Retro Report                                │
│                                                         │
│  INPUT: Sprint retro notes from Scrum Master            │
│  OUTPUT: Professional Word doc for leadership           │
│                                                         │
│  YOU DO: Review, add context the notes missed, send to  │
│  RTE for PI readout. Use recommendations to inform      │
│  next PI's feature brief work.                          │
└─────────────────────────────────────────────────────────┘
```

---

## How the BA Works With PO and Tech Lead Using This Toolkit

```
                    ┌──────────┐
                    │    VP    │
                    │(stakeholder)│
                    └─────┬────┘
                          │ vague requirement
                          ▼
               ┌─────────────────────┐
               │   Product Owner     │
               │                     │
               │ • Approves scope    │
               │ • Sets priorities   │
               │ • Makes decisions   │
               └──────┬──────────────┘
                      │ "clean this up"
                      ▼
          ┌───────────────────────────┐
          │    Business Analyst       │
          │                           │
          │ • Gathers context         │◄──── Talks to compliance,
          │ • Generates feature brief │      advisors, legal
          │ • Decomposes into stories │
          │ • Refines for meetings    │──── Sends stories to
          │ • Builds PI workbook      │     Tech Lead for
          │ • Creates status reports  │     technical notes
          │ • Compiles retro report   │
          └───────────┬───────────────┘
                      │ story files with
                      │ Technical Notes blank
                      ▼
             ┌─────────────────────┐
             │    Tech Lead        │
             │                     │
             │ • Adds tech notes   │◄──── Scans codebase,
             │ • Validates sizing  │      adds file paths
             │ • Reviews arch risk │      and patterns
             └─────────────────────┘
```

### The handoff pattern

1. **BA generates the feature brief** → PO reviews and approves scope
2. **BA generates stories** (business-focused, no tech details) → sends to Tech Lead
3. **Tech Lead adds Technical Notes** to each story (affected files, patterns, API changes)
4. **BA runs the refiner** on the complete stories → catches vague language, adds edge cases
5. **BA builds the PI workbook** with input from PO (priorities) and Tech Lead (sizing adjustments)
6. **Everyone walks into refinement with stories ready to estimate**

---

## What Changes for You as BA

| Before (manual) | After (with toolkit) |
|-----------------|---------------------|
| 3-4 hours writing feature briefs in Confluence | 30 minutes — prompt with stakeholder context + review |
| Full day writing 10-15 stories with acceptance criteria | 20 minutes — prompt + review + send to Tech Lead |
| Acceptance criteria missing edge cases (found during sprint as bugs) | Edge cases surfaced automatically during story generation |
| 2-hour refinement meetings rewriting stories live | 45 minutes — stories arrive pre-refined with INVEST checks |
| Full day building PI workbook from a blank spreadsheet | 20 minutes — prompt with team details + review |
| Half day compiling retro notes into a report | 15 minutes — prompt + add context |
| Weekly status reports: 45 min each Friday | 10 minutes — prompt with updates + review |
| UAT test scenarios written from scratch | 15 minutes — generated from acceptance criteria |

### Total time saved per PI: ~25-30 hours of artifact creation

That's time you reinvest in the work that makes you valuable as a BA — stakeholder interviews, process analysis, requirements elicitation, edge case thinking, and making sure the team builds the right thing.

---

## Tips for Business Analysts

1. **Enrich every prompt with stakeholder context** — the agent can't attend your meetings. The more context you add from your conversations with compliance, advisors, and the VP, the better the output. A 5-line Aha! requirement with 10 lines of your research produces dramatically better results than the Aha! requirement alone.

2. **Tell the agent your role** — start prompts with "I'm the Business Analyst" or "focus on business behavior, not implementation." This shifts the output from technical jargon to user workflows and testable criteria.

3. **Leave Technical Notes blank intentionally** — don't guess at implementation details. Generate stories with business-focused AC and let the Tech Lead fill in the technical sections. This keeps your stories focused on the "what" and prevents premature technical decisions.

4. **Use the refiner as your QA pass** — run it the afternoon before refinement. It catches vague language and missing edge cases that you'll miss at 4pm on a Wednesday. Think of it as a spell-checker for requirement quality.

5. **Chain outputs as inputs** — the feature brief feeds the decomposer, the stories feed the refiner, the refined stories feed the PI workbook. Each step builds on the previous one. Don't skip steps — the quality compounds.

6. **Generate UAT scenarios from stories** — your acceptance criteria in Given/When/Then are literally test cases. Ask the agent to format them as a UAT document for business testers. No translation needed.

7. **Keep the PI workbook as a living document** — after PI planning, update the workbook each sprint with actuals vs plan. The variance formulas will automatically flag when you're off track.

8. **Use Word docs for leadership, not Confluence** — the VP and compliance officers want a `.docx` they can email, not a Confluence link they need to log into. The toolkit generates real Word files with professional formatting.
