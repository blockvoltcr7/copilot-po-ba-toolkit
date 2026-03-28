# Sprint Refinement Prep — 5 Stories Refined

**Date**: 2026-03-28
**Source**: `test-data/draft-stories/poorly-written-stories.md`
**Sizing scale**: 1 / 2 / 3 / 5 only
**Priority scale**: P1–P4

---

## Summary Table

| # | Story | INVEST | Original Size | Refined Size | Issues Found | Action |
|---|-------|--------|---------------|-------------|--------------|--------|
| 1 | Portfolio Alert Dashboard | 2/6 ✗ | 13 | Split → 3+3+2 | Vague role, no real benefit, all AC untestable, way oversized | **Split into 3 stories** |
| 2 | Risk Calculation Engine | 1/6 ✗ | 8 | Split → 3+3+2 | No "so that", only 2 vague AC, oversized | **Split into 3 stories** |
| 3 | Notification Service | 5/6 ✓ | 5 | 5 | AC not in Given/When/Then, needs edge cases | **Refined — Ready** |
| 4 | Compliance Reporting | 3/6 ⚠ | 5 | 5 | "etc." in AC, "trend data" vague, not testable | **Refined — Ready** |
| 5 | Mobile Push Notifications | 3/6 ⚠ | 3 | 3 | "secure" and "performant" are vague, dependency on Story 3 | **Refined — Ready** |

---

## Story 1: Portfolio Alert Dashboard (Refined)

### Changes Made
- **Replaced vague role**: "a user" → "a financial advisor"
- **Replaced vague benefit**: "do my job better" → specific benefit about monitoring portfolio risk
- **Rewrote all 3 AC** from untestable to Given/When/Then format
- **Added 4 new AC** to cover the scope implied by a "dashboard"
- **Flagged 3 vague phrases**: "show up on the dashboard", "work properly", "handle errors appropriately"
- **Recommended split**: 13 pts → three stories (3 + 3 + 2 = 8 pts)

### Vague Language Flagged

| Original (Vague) | Problem | Replacement |
|---|---|---|
| "As a **user**" | Non-specific role — who is this user? | "As a **financial advisor**" |
| "so that I can **do my job better**" | Not a real benefit — doesn't explain what value is delivered | "so that I can **monitor portfolio risk alerts at a glance and act on critical issues within minutes**" |
| "Alerts should **show up** on the dashboard" | Untestable — what alerts? What format? How many? | Specific AC with alert types, sort order, and display rules |
| "It should **work properly**" | Completely untestable — this is meaningless as AC | Replaced with specific functional requirements |
| "**Handle errors** appropriately" | Vague — what errors? What is "appropriate"? | Specific error scenarios with expected behavior |

### INVEST Score: 2/6

```
INVEST Check (Original):
  I — Independent:  ✓ Pass — No blocking dependencies identified
  N — Negotiable:   ✓ Pass — Implementation approach is flexible
  V — Valuable:     ✗ Fail — "do my job better" is not a real business benefit
  E — Estimable:    ✗ Fail — AC too vague to estimate; "work properly" gives no scope
  S — Small:        ✗ Fail — Size 13 far exceeds ceiling of 5; must split
  T — Testable:     ✗ Fail — None of the 3 AC can be turned into a test
```

### ⚠ Split Recommendation (Original 13 pts)

This story is estimated at **13 points**, which is more than double the ceiling. It should be split into 3 independent stories:

---

#### Story 1a: Portfolio Alert Dashboard — Alert Data & API (3 pts, P2)

**User Story**
As a financial advisor, I want an API endpoint that returns my active portfolio alerts sorted by severity, so that the dashboard and other clients can display real-time alert data.

**Acceptance Criteria**
- **Given** an authenticated advisor with 3 client portfolios, **When** the advisor calls `GET /api/alerts`, **Then** the response contains all active alerts across those portfolios sorted by severity (P1 first), each including: alert ID, client name, portfolio ID, severity (P1–P4), alert type, triggered timestamp, and summary message.
- **Given** an advisor with no active alerts, **When** the advisor calls `GET /api/alerts`, **Then** the response returns an empty array with HTTP 200 and no error.
- **Given** an advisor requests alerts, **When** the alert service is unavailable, **Then** the API returns HTTP 503 with error body `{ "error": "alert_service_unavailable", "message": "..." }` and the response completes within 5 seconds (timeout).

**Edge Cases**
- Advisor has 500+ active alerts → response is paginated (max 50 per page)
- Alert was triggered but the underlying portfolio was deleted → alert is excluded from response with a warning logged server-side

---

#### Story 1b: Portfolio Alert Dashboard — UI Component (3 pts, P2)

**User Story**
As a financial advisor, I want to see my portfolio alerts displayed on my dashboard as a prioritized list with severity indicators, so that I can identify critical risk issues at a glance.

**Acceptance Criteria**
- **Given** the advisor dashboard is loaded and the alert API returns 5 alerts, **When** the dashboard renders, **Then** all 5 alerts are displayed in a list sorted by severity (P1 first), each showing: client name, alert type, severity badge (color-coded: red=P1, orange=P2, yellow=P3, blue=P4), and time since triggered.
- **Given** the advisor dashboard is loaded and the alert API returns an empty array, **When** the dashboard renders, **Then** an empty state message ("No active alerts") is displayed instead of the alert list.
- **Given** the advisor dashboard is loaded, **When** the alert API call fails, **Then** an error banner is displayed with the message "Unable to load alerts. Retry?" and a retry button that re-calls the API.

**Edge Cases**
- Advisor's screen is 320px wide (mobile) → alert list stacks vertically with truncated client names
- Alert was triggered 30 days ago → displays "30d ago" not a full timestamp

---

#### Story 1c: Portfolio Alert Dashboard — Real-Time Updates (2 pts, P3)

**User Story**
As a financial advisor, I want the alert dashboard to update automatically when new alerts are triggered, so that I don't need to manually refresh to see the latest risk events.

**Acceptance Criteria**
- **Given** the advisor is viewing the dashboard, **When** a new P1 alert is triggered for one of their portfolios, **Then** the alert appears at the top of the list within 30 seconds without a page refresh.
- **Given** the advisor is viewing the dashboard, **When** an existing alert is resolved, **Then** the alert is removed from the list within 30 seconds without a page refresh.

**Edge Cases**
- Advisor loses network connection → a "Connection lost" banner appears; when reconnected, the full alert list is re-fetched
- 10 new alerts arrive simultaneously → all 10 appear in a single batch update, not 10 individual re-renders

---

## Story 2: Risk Calculation Engine (Refined)

### Changes Made
- **Added missing "so that" clause** with specific business value
- **Rewrote 2 vague AC** into Given/When/Then format with specific inputs/outputs
- **Added 4 new AC** to cover calculation logic, update triggers, and data requirements
- **Added 3 edge cases** for boundary conditions and error handling
- **Flagged 2 vague phrases**: "calculate risk scores", "update when market data changes"
- **Recommended split**: 8 pts → three stories (3 + 3 + 2 = 8 pts)

### Vague Language Flagged

| Original (Vague) | Problem | Replacement |
|---|---|---|
| "I want the system to **calculate portfolio risk**" | No "so that" clause — why does the advisor need this? What decisions does it enable? | Added: "so that I can assess whether client portfolios align with their stated risk tolerance and make informed rebalancing recommendations" |
| "**Calculate risk scores** for portfolios" | What scoring model? What inputs? What is the output format/range? | Specific: given portfolio holdings, calculate a risk score 0–100 using weighted standard deviation of asset returns |
| "**Update when market data changes**" | What market data? How often? What counts as a "change"? Real-time or batch? | Specific: recalculate when daily closing prices are ingested (end-of-day batch) |

### INVEST Score: 1/6

```
INVEST Check (Original):
  I — Independent:  ✓ Pass — No blocking dependencies
  N — Negotiable:   ⚠ Needs Work — "calculate portfolio risk" could mean many things; team needs to negotiate the calculation model
  V — Valuable:     ✗ Fail — Missing "so that" clause entirely; no stated business value
  E — Estimable:    ⚠ Needs Work — "risk scores" is undefined; can't estimate what we don't understand
  S — Small:        ✗ Fail — Size 8 exceeds ceiling of 5; must split
  T — Testable:     ⚠ Needs Work — "calculate risk scores" has no expected output to verify against
```

### ⚠ Split Recommendation (Original 8 pts)

This story is estimated at **8 points**. It should be split into 3 independent stories:

---

#### Story 2a: Risk Calculation Engine — Core Scoring Algorithm (3 pts, P1)

**User Story**
As a financial advisor, I want the system to calculate a numeric risk score (0–100) for a client portfolio based on its asset allocation and historical volatility, so that I can objectively assess whether the portfolio matches the client's stated risk tolerance.

**Acceptance Criteria**
- **Given** a portfolio with 60% equities (large-cap US), 30% bonds (investment grade), and 10% cash, **When** the risk score is calculated, **Then** the score is between 35–50 (moderate risk) using weighted standard deviation of 3-year trailing daily returns.
- **Given** a portfolio with 100% cash or money-market funds, **When** the risk score is calculated, **Then** the score is between 0–5 (minimal risk).
- **Given** a portfolio containing an asset with no historical price data, **When** the risk score is calculated, **Then** the system uses a configurable default volatility value for that asset class and flags the score as "estimated" in the response.

**Edge Cases**
- Portfolio contains a single holding → risk score equals the individual asset's annualized volatility mapped to 0–100 scale
- Portfolio contains assets across 5+ asset classes → all classes are weighted proportionally; no class is excluded

---

#### Story 2b: Risk Calculation Engine — Market Data Integration (3 pts, P1)

**User Story**
As a financial advisor, I want portfolio risk scores to be recalculated automatically when daily market closing prices are received, so that risk assessments reflect the most recent market conditions.

**Acceptance Criteria**
- **Given** end-of-day market data is ingested for equities at 6:00 PM ET, **When** the ingestion job completes, **Then** all portfolios containing those equities have their risk scores recalculated within 60 minutes.
- **Given** a portfolio's recalculated risk score changes by more than 5 points from its previous score, **When** the recalculation completes, **Then** the system writes a `risk_score_changed` event to the event bus with the old score, new score, and portfolio ID.
- **Given** the market data feed is unavailable during the scheduled ingestion window, **When** ingestion fails, **Then** the system retries 3 times at 10-minute intervals, then raises an operational alert and preserves the last known risk scores.

**Edge Cases**
- Market holiday (no new data) → no recalculation is triggered; scores remain unchanged
- Data arrives for only 50% of a portfolio's holdings → recalculation proceeds with stale prices for missing holdings, and the score is flagged as "partial"

---

#### Story 2c: Risk Calculation Engine — Tolerance Comparison & API (2 pts, P2)

**User Story**
As a financial advisor, I want an API endpoint that compares a portfolio's current risk score against the client's stated risk tolerance, so that I can quickly identify portfolios that need rebalancing.

**Acceptance Criteria**
- **Given** a portfolio with risk score 72 and client risk tolerance set to "Moderate" (range 30–55), **When** the advisor calls `GET /api/portfolios/{id}/risk-assessment`, **Then** the response includes: `{ "score": 72, "tolerance": "Moderate", "tolerance_range": [30, 55], "status": "EXCEEDED", "drift": 17 }`.
- **Given** a portfolio with risk score 45 and tolerance range 30–55, **When** the endpoint is called, **Then** the status is `"WITHIN_TOLERANCE"` and drift is `0`.

**Edge Cases**
- Client has no risk tolerance set → API returns status `"TOLERANCE_NOT_SET"` with a message prompting the advisor to configure it

---

## Story 3: Notification Service (Refined)

### Changes Made
- **Converted 3 AC** from plain statements to Given/When/Then format (originals were solid but not in required format)
- **Added 3 edge cases** for error handling and boundary conditions
- **Added technical notes** about dependency on risk calculation engine events
- Story was well-written — minimal changes needed

### Vague Language Flagged

No significant vague language detected. This story was well-written. ✓

### INVEST Score: 5/6

```
INVEST Check (Original):
  I — Independent:  ✓ Pass — Can be developed once risk scores exist (Story 2 delivers this)
  N — Negotiable:   ✓ Pass — Implementation approach is flexible (email provider, template, etc.)
  V — Valuable:     ✓ Pass — Clear benefit: "take corrective action before quarterly review"
  E — Estimable:    ✓ Pass — Scope is clear with 3 well-defined AC
  S — Small:        ✓ Pass — Size 5 is at the ceiling but acceptable for this scope
  T — Testable:     ⚠ Needs Work — AC are testable in spirit but not in Given/When/Then format
```

### User Story
As a financial advisor, I want to receive notifications when a client's portfolio drifts outside their risk tolerance, so that I can take corrective action before the next quarterly review.

### Acceptance Criteria
- **Given** a client portfolio with risk tolerance set to "Moderate" (score range 30–55) and the portfolio's risk score changes to 62, **When** the risk score exceeds the tolerance threshold, **Then** an email notification is sent to the assigned advisor within 5 minutes containing: client name, account number, current risk score (62), tolerance level ("Moderate"), and the amount of drift (+7 points).
- **Given** a notification is generated for a portfolio risk drift event, **When** the email is composed, **Then** it includes the client name, account number, current risk score, tolerance level and range, drift amount, and a deep link to the portfolio detail page.
- **Given** an advisor has received a risk drift notification, **When** the advisor clicks "Snooze for 7 days" in the notification email or dashboard, **Then** no further notifications are sent for that specific client/portfolio combination for 7 calendar days, and the snooze expiration date is displayed on the portfolio detail page.

### Edge Cases
- Email delivery fails (SMTP error) → notification is queued for retry (3 attempts, 5-minute intervals); if all fail, an operational alert is raised and the notification is logged as "failed"
- Portfolio drifts back within tolerance during the snooze period → the snooze is automatically cancelled and the alert is cleared
- Advisor has 50 portfolios all exceeding tolerance simultaneously → notifications are batched into a single digest email (max 50 items) rather than 50 individual emails

### Size
**5** — Acceptable. Includes email sending, snooze logic, and integration with risk scoring events. At the limit but reasonable for one sprint.

### Priority
**P2** — Important for advisor workflow but not a launch blocker; requires risk calculation (Story 2) to be in place first.

---

## Story 4: Compliance Reporting (Refined)

### Changes Made
- **Removed "etc."** — expanded into 3 explicit acceptance criteria replacing the vague placeholder
- **Replaced "trend data"** with specific metrics: month-over-month drift counts, average drift duration, and repeat offenders
- **Converted all AC** to Given/When/Then format
- **Added 3 edge cases** for no-data scenarios and large data volumes
- **Flagged 2 vague phrases**: "Include trend data", "etc."

### Vague Language Flagged

| Original (Vague) | Problem | Replacement |
|---|---|---|
| "Include **trend data**" | What trends? Over what time period? What format? | Specific: month-over-month count of tolerance breaches, average duration of drift events, and top-10 repeat-offending accounts |
| "**etc.**" | Explicitly prohibited — must list all requirements | Expanded into: export to PDF, audit trail of report generation, and regulatory formatting compliance |

### INVEST Score: 3/6

```
INVEST Check (Original):
  I — Independent:  ✓ Pass — Can be developed once risk scoring data exists
  N — Negotiable:   ✓ Pass — Report format, delivery method are negotiable
  V — Valuable:     ✓ Pass — Clear regulatory and compliance benefit
  E — Estimable:    ⚠ Needs Work — "trend data" and "etc." leave scope undefined
  S — Small:        ✓ Pass — Size 5 is acceptable if scope is tightened
  T — Testable:     ✗ Fail — "Include trend data" and "etc." cannot be tested; AC #4 is literally "etc."
```

### User Story
As a compliance officer, I want to see risk drift patterns across all advisors and clients, so that we can identify systemic issues and demonstrate proactive monitoring to regulators.

### Acceptance Criteria
- **Given** the current month has ended, **When** a compliance officer navigates to Reports → Monthly Compliance and selects the month, **Then** the system generates a report listing every account that exceeded its risk tolerance threshold at any point during that month, including: account number, client name, assigned advisor, risk tolerance level, peak risk score, date tolerance was first breached, and date it returned to tolerance (or "Still exceeded" if ongoing).
- **Given** the compliance report is generated for the past 6 months, **When** the "Trends" section is displayed, **Then** it shows: (a) month-over-month count of new tolerance breaches, (b) average duration of drift events in business days, and (c) a "Top 10 Repeat Offenders" list showing accounts that exceeded tolerance in 3+ of the last 6 months.
- **Given** the compliance report is generated, **When** the officer clicks "Export to PDF", **Then** the report is exported as a PDF formatted per SEC/FINRA regulatory template standards with the report generation timestamp, officer name, and a unique report ID in the header.
- **Given** any compliance report is generated or exported, **When** the action completes, **Then** an audit log entry is created recording: officer user ID, report parameters (date range, filters), generation timestamp, and export format (if exported).
- **Given** a compliance officer opens the report, **When** no accounts exceeded tolerance in the selected month, **Then** the report displays a "No Breaches Detected" summary with the total number of monitored accounts and a confirmation that all portfolios were within tolerance.

### Edge Cases
- Month has 10,000+ accounts to report → report generation runs asynchronously and the officer is notified via email when it's ready (with download link)
- Advisor was reassigned mid-month → report shows both the original and current advisor for affected accounts
- Risk tolerance was changed for a client mid-month → report uses the tolerance that was in effect at the time of each breach event

### Size
**5** — At the ceiling. Scope is now well-defined: one monthly report with trends, export, and audit logging. Acceptable for one sprint.

### Priority
**P2** — Important for regulatory compliance but not a real-time operational need.

---

## Story 5: Mobile Push Notifications (Refined)

### Changes Made
- **Replaced "Should be secure"** with specific security requirements: encrypted payload, token-based device auth, no PII in notification preview
- **Replaced "Should be performant"** with specific metric: push delivered within 30 seconds of alert trigger
- **Converted all AC** to Given/When/Then format
- **Added 3 edge cases** for device management and delivery failures
- **Flagged 2 vague phrases**: "Should be secure", "Should be performant"

### Vague Language Flagged

| Original (Vague) | Problem | Replacement |
|---|---|---|
| "**Should be secure**" | Untestable — what does "secure" mean for push notifications? | Specific: notification payload is encrypted in transit (TLS 1.2+), device registration uses token-based auth, notification preview on lock screen shows "New Alert" without client names or account numbers (no PII) |
| "**Should be performant**" | Untestable — what is the performance target? | Specific: push notification is delivered to the device within 30 seconds of the alert being triggered, measured end-to-end |

### INVEST Score: 3/6

```
INVEST Check (Original):
  I — Independent:  ⚠ Needs Work — Depends on notification service (Story 3) and alert severity system
  N — Negotiable:   ✓ Pass — Push provider, UX details are negotiable
  V — Valuable:     ✓ Pass — Clear benefit: respond to critical alerts away from desk
  E — Estimable:    ⚠ Needs Work — "secure" and "performant" leave scope undefined
  S — Small:        ✓ Pass — Size 3 is reasonable for push notification delivery
  T — Testable:     ⚠ Needs Work — 2 of 5 AC cannot be tested as written ("secure", "performant")
```

### User Story
As a financial advisor, I want push notifications on my phone when critical risk alerts fire, so that I can respond quickly even when I'm not at my desk.

### Acceptance Criteria
- **Given** a P1 severity alert is triggered for one of my portfolios, **When** the alert event is processed, **Then** a push notification is delivered to all of my registered devices (iOS and Android) within 30 seconds, displaying the alert severity, alert type, and a generic message ("New Alert — Tap for details") without exposing client names or account numbers on the lock screen.
- **Given** a P3 or P4 severity alert is triggered, **When** the alert event is processed, **Then** no push notification is sent (only P1 and P2 alerts trigger push).
- **Given** an advisor navigates to Settings → Quiet Hours, **When** the advisor sets quiet hours from 10:00 PM to 7:00 AM in their local timezone, **Then** push notifications are suppressed during that window, queued, and delivered as a batch summary at the end of the quiet period. P1 alerts override quiet hours and are delivered immediately.
- **Given** a push notification is sent, **When** the notification is in transit, **Then** the payload is encrypted via TLS 1.2+ and the device is authenticated via a token issued during device registration (no static API keys).
- **Given** the push notification delivery service (APNs/FCM) is unavailable, **When** a notification fails to deliver, **Then** the system retries 3 times at 1-minute intervals and logs the failure; if all retries fail, the notification is marked as "undelivered" and included in the next batch summary.

### Edge Cases
- Advisor has 3 registered devices (2 iPhones, 1 Android) → notification is sent to all 3; delivery failure on one does not block the others
- Advisor uninstalls the app → the push token becomes invalid; the system detects the invalid token response from APNs/FCM and removes the device from the registry
- 20 P1 alerts fire within 1 minute → notifications are batched: first alert sends immediately, subsequent alerts within a 60-second window are grouped into a single "X new critical alerts" summary push

### Size
**3** — Appropriate. Core scope is push delivery to two platforms with quiet hours and severity filtering. Security and performance are now specific testable requirements, not open-ended.

### Priority
**P2** — High value for advisor responsiveness but requires notification service (Story 3) to be in place first.

---

## Appendix: All Vague Language Detected

| Story | Original Phrase | Issue | Refinement |
|-------|----------------|-------|------------|
| 1 | "As a **user**" | Non-specific role | → "As a **financial advisor**" |
| 1 | "**do my job better**" | Unmeasurable benefit | → specific monitoring & response benefit |
| 1 | "**show up** on the dashboard" | Untestable display requirement | → specific UI rendering rules |
| 1 | "**work properly**" | Meaningless as AC | → specific functional requirements |
| 1 | "**Handle errors** appropriately" | No error types or behaviors specified | → specific error scenarios with responses |
| 2 | *(missing "so that")* | No business value stated | → added risk tolerance & rebalancing benefit |
| 2 | "**Calculate risk scores**" | No scoring model, inputs, or output range | → weighted std dev, 0–100 scale, specific inputs |
| 2 | "**Update when market data changes**" | Undefined trigger, frequency, scope | → end-of-day batch recalculation with specific timing |
| 4 | "**trend data**" | Undefined metrics and timeframe | → month-over-month breach counts, avg duration, repeat offenders |
| 4 | "**etc.**" | Explicitly prohibited; must enumerate all items | → expanded to PDF export, audit logging, regulatory formatting |
| 5 | "**Should be secure**" | Untestable blanket statement | → TLS 1.2+, token auth, no PII on lock screen |
| 5 | "**Should be performant**" | No target metric | → delivered within 30 seconds end-to-end |
