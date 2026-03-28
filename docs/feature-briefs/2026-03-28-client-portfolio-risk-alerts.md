# Feature Brief: Real-Time Portfolio Risk Alerts

## Source
- **Origin**: Aha! WEALTH-2847 — Initiative: Client Experience Modernization
- **Date**: 2026-03-28
- **Requested by**: VP of Wealth Management
- **Team**: Portfolio Services (Mustangs)
- **Target PI**: PI 26.3 (May 4 – Aug 21, 2026)
- **Status**: Draft

---

## Business Context

### What the Business Wants
Automated, continuous monitoring of client portfolio risk levels against each client's stated risk tolerance, with real-time alerts surfaced to the assigned financial advisor when drift is detected. Replaces the current quarterly manual review process with proactive, threshold-based notifications delivered via dashboard, email, and (eventually) mobile push.

### Business Value
- **Regulatory compliance**: FINRA suitability monitoring scrutiny is increasing; SEC examination cycle is imminent. This feature provides documented, automated evidence of proactive risk oversight.
- **Operational efficiency**: Advisors managing 200–400 client relationships cannot manually monitor risk drift at scale. Automation reduces oversight gaps from months to minutes.
- **Client experience**: Proactive risk management reduces the likelihood of adverse client outcomes and strengthens advisor–client trust.
- **Compliance visibility**: Gives the compliance team firm-wide risk drift data to identify systemic issues and satisfy regulator inquiries.

### Target Users / Personas
- **Financial Advisors** — primary audience. Manage 200–400 client relationships each. Need actionable, prioritized alerts surfaced at login and via email so they can intervene before drift becomes a suitability violation.
- **Compliance Officers** — secondary audience. Need aggregate, trend-based views of risk drift across all advisors and clients to demonstrate proactive monitoring to FINRA/SEC.
- **Clients** — indirect beneficiaries. Not a direct user of this feature in PI 26.3 scope.

---

## Technical Analysis

### Affected Systems / Services

| System / Service | Type of Change | Complexity |
|-----------------|---------------|------------|
| Risk Calculation Engine | New (or extend legacy) | L |
| Advisor Dashboard (Frontend) | Modify — add alert widget | M |
| Notification Service | New | M |
| Market Data Service (external) | Integrate — consume real-time feed | M |
| Compliance Reporting Module | New | M |
| Legacy Risk Calculator | Deprecate / migrate (Feature 4 — parallel track) | L |
| CRM Integration | Integrate (stretch / future PI) | XL |
| Mobile Push Notification Service | New foundation (Feature 5 — parallel track) | M |

### Key Files & Modules
> **Note**: The codebase in this repository is the Copilot CLI skills demo project (Node.js document generation tooling), not the Portfolio Services platform itself. Technical analysis below is grounded in domain artifacts found in `test-data/` and `docs/`, which represent the team's actual operating context.

- `test-data/aha-requirements/client-portfolio-risk-alerts.md` — source requirement (WEALTH-2847)
- `test-data/pi-planning/pi-26-3-inputs.md` — PI 26.3 team roster, velocity baseline (36 pts/sprint), feature sizing estimates, known risks
- `test-data/draft-stories/poorly-written-stories.md` — five original draft stories (pre-refinement) for: Portfolio Alert Dashboard, Risk Calculation Engine, Notification Service, Compliance Reporting, Mobile Push Notifications
- `generated/output/refined-stories.md` — refined versions of all 5 stories with full Given/When/Then acceptance criteria; draft 1 was split into 1a (Alert API), 1b (Alert UI), 1c (Real-time updates); draft 2 split into 2a (risk algorithm), 2b (market data integration), 2c (tolerance API). Contains implied API contracts and edge cases.
- `docs/plans/2026-03-28-po-techlead-skills-design.md` — SAFe conventions: Fibonacci sizing (1/2/3/5), P1–P4 priority, 2-week sprints, Aha! → Jira auto-push

### Existing Patterns to Follow
- **SAFe delivery model**: Stories sized 1/2/3/5 (Fibonacci subset). Prioritized P1–P4. Delivered in 2-week sprints across 8-sprint PIs.
- **Toolchain**: Aha! is the source of truth for requirements and auto-pushes to Jira. Agent integration available via Jira MCP.
- **Legacy Risk Calculator**: An existing legacy risk calculator is already identified for migration in PI 26.3 (Feature 4). The new Risk Calculation Engine should align with the target architecture of that migration effort — coordinate with the tech debt track to avoid duplicating or conflicting implementations.
- **Draft story structure**: The team has already drafted 5 stories (see `test-data/draft-stories/`). These are valid building blocks but require significant refinement before sprint commitment.

### Current Architecture (Relevant)
The team currently has a **Legacy Risk Calculator** that performs risk scoring, targeted for migration in PI 26.3 (Feature 4). Risk monitoring today is entirely manual — advisors run periodic reviews rather than using any automated threshold detection. There is an existing **Market Data Service** owned by a separate team, with a new API expected to be available by Sprint 2 of PI 26.3. The advisor-facing dashboard exists but does not currently surface real-time risk alerts. No notification service for risk events exists.

**Implied data model from refined stories** (to be validated with architecture review):
- Risk score is a numeric value on a **0–100 scale** (0–5 = minimal/cash, 35–50 = moderate, 70–100 = aggressive); compared against client tolerance range (e.g., `[30, 55]`)
- Drift threshold for triggering an event: **>5 points** change in portfolio risk score
- Risk recalculation trigger: **end-of-day (6:00 PM ET)** market data ingestion, with retry logic (3 attempts × 10-minute intervals)
- Event published on breach: `risk_score_changed { portfolio_id, old_score, new_score }`
- Key REST contracts implied: `GET /api/alerts` (advisor-scoped, sorted by severity), `GET /api/portfolios/{id}/risk-assessment` (score vs. tolerance comparison)

---

## Scope & Boundaries

### In Scope (PI 26.3)
- Risk Calculation Engine: evaluate portfolio risk score against client's stated risk tolerance profile
- Risk drift detection logic with configurable thresholds (by client segment)
- Advisor dashboard alert widget: surface active risk alerts at login
- Email notification to advisor when a client's portfolio breaches tolerance threshold
- Alert management: advisor can acknowledge / snooze alerts (7-day snooze per draft story)
- Compliance reporting: monthly aggregate report of all accounts that exceeded risk tolerance, with trend data, accessible to compliance officers
- Support for all account types: individual, joint, trust, IRA, 401k rollover
- Integration with Market Data Service (new API, Sprint 2 dependency)

### Out of Scope (PI 26.3)
- Mobile push notifications — foundation work is Feature 5 (parallel P3 track); risk alert push notifications depend on that foundation and are deferred to a future PI
- CRM integration — flagged as "a plus" in the requirement; deferred due to XL complexity and no stated regulatory driver
- Client-facing alerts or a client portal — not mentioned in WEALTH-2847; would require separate UX discovery
- AI-assisted recommendations — new FINRA guidelines expected Q3; deliberately excluded to avoid compliance risk until guidelines are published
- Real-time threshold configuration UI — advisors can view alerts; threshold configuration is admin/compliance-controlled in PI 26.3 scope

### Assumptions
- The Market Data Service API will be available by Sprint 2 of PI 26.3 (per PI planning inputs; flagged as a risk if it slips)
- Clients have an existing **risk tolerance profile** stored in the system (stated tolerance level); this feature reads it but does not modify it
- The existing auth system supports role-based access for Advisor vs. Compliance Officer roles
- The Legacy Risk Calculator migration (Feature 4) proceeds on a parallel track; the new Risk Calculation Engine should be designed to replace it, with coordination from Tech Lead
- "Real-time" is defined as within 15 minutes of market data update, not sub-second streaming (given API polling model)
- FINRA suitability monitoring requirements are met by demonstrating automated detection and advisor notification — legal/compliance to confirm

---

## Risks & Dependencies

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Market Data Service API slips past Sprint 2 | Med | High | Build risk engine with a mock/stub data source; integrate real API when available. Don't block dashboard/notification work. |
| Legacy Risk Calculator migration (Feature 4) conflicts with new engine design | Med | High | Schedule joint architecture session between risk alert feature team and tech debt track before Sprint 1 kickoff. |
| New FINRA AI-assisted recommendation guidelines (Q3) impact alert logic | Low | High | Keep alert logic rules-based and auditable in PI 26.3. Avoid any ML/AI components. Review guidelines when published. |
| Threshold configuration complexity underestimated (per-segment rules) | Med | Med | Define MVP as firm-wide default thresholds with segment overrides. Full per-client config is future scope. |
| Team velocity risk: Chen Wei ramping (75% first 2 sprints), James Wright on-call rotation (75% Sprint 1 & 5) | High | Med | Assign ramping/on-call engineers to lower-complexity tasks. Front-load senior engineer capacity on risk engine core. |
| Lisa Park 50% availability Sprint 3 | Med | Med | Plan around her availability; avoid assigning her to sprint 3 critical path items. |

### External Dependencies

- **Market Data Service team** — new real-time data API required; confirmed available Sprint 2 at earliest. This is the single most critical external dependency.
- **Mobile Platform team** — mobile push notification SDK (Feature 5) required before risk alerts can be pushed to mobile. SDK expected Sprint 3. Risk alerts on mobile are out of PI 26.3 scope.
- **Compliance / Legal team** — must confirm that automated threshold-based detection + advisor notification satisfies FINRA suitability monitoring requirements before PI 26.3 closes.
- **CRM vendor** — not in scope for PI 26.3; flagged for future PI discovery.

### Data & Migration Concerns
- The new Risk Calculation Engine must produce risk scores in a format compatible with (or superseding) the legacy calculator's output, to avoid breaking downstream consumers during the transition.
- Historical risk scores should be retained for compliance reporting trend data. Confirm retention policy with compliance team.
- Client risk tolerance profiles are read-only inputs for this feature; no schema migration expected for the tolerance data itself.
- Alert state (acknowledged, snoozed, active) will require a new data store / schema. Design for audit trail from day one — regulators may request alert history.

---

## Open Questions

### Needs PO Clarification
- [ ] What defines a client's "risk tolerance"? Is it a single numeric score, a category (Conservative / Moderate / Aggressive), or a multi-dimensional profile? The calculation logic depends on this.
- [ ] What is the threshold for triggering an alert? Is it a fixed percentage drift, an absolute score difference, or configurable? What are the default thresholds per client segment?
- [ ] Should advisors receive one alert per breach event, or ongoing reminders until the drift is corrected? What is the "all-clear" mechanism?
- [ ] How should alerts be prioritized? The requirement mentions "P1 and P2 severity" in the mobile story — what defines severity tiers?
- [ ] Is the 7-day snooze duration fixed or configurable by the advisor?
- [ ] What does "configurable alert thresholds per client segment" mean exactly — who configures them (admin, compliance, advisor), and what segments exist?

### Needs Architecture Review
- [ ] Should the Risk Calculation Engine be a new standalone service or an extension of the existing portfolio service? Evaluate in context of the Legacy Risk Calculator migration (Feature 4).
- [ ] What is the appropriate data consistency model for risk scores — eventual consistency (acceptable for 15-min window) or stronger guarantees? Impacts database and event architecture choices.
- [ ] Should alert events be stored in the primary database or a dedicated audit/event store? Consider compliance retention requirements.
- [ ] How does the notification service integrate with the existing email infrastructure? Is there an existing email service or does one need to be provisioned?

### Needs Stakeholder Input
- [ ] Confirm with compliance/legal that automated threshold breach detection + advisor email notification satisfies FINRA suitability monitoring requirements for the upcoming SEC examination.
- [ ] Is the PI 26.3 delivery date firm given the regulatory driver, or is there flexibility if the Market Data API slips?
- [ ] Does the compliance reporting need to be exportable (PDF, CSV) for regulator submission, or is on-screen access sufficient?

---

## Recommended Approach

Build the Risk Calculation Engine as an extension of (or clean replacement for) the Legacy Risk Calculator, in close coordination with the PI 26.3 tech debt migration track (Feature 4). Design the engine to consume market data from the Market Data Service API via a polling or event-driven adapter — stub the adapter in Sprint 1 so dashboard and notification work can proceed in parallel without blocking on the external API. Risk scores and threshold breach events should be persisted with a full audit trail to support compliance reporting from day one.

For the advisor-facing experience, extend the existing dashboard with an alert widget that surfaces active, unacknowledged breaches on login. The notification service should be implemented as a lightweight, independently deployable component that consumes breach events and dispatches email alerts via the existing email infrastructure. Design the notification service interface to be extensible — mobile push (Feature 5) should be able to plug in as a new delivery channel in a future PI without requiring a rewrite. Compliance reporting should be a scheduled aggregate query over the alert audit trail, with a simple officer-facing view.

### Complexity Estimate
- **Overall**: **L**
- **Reasoning**: L — spans 3 new components (risk engine, notification service, compliance reporting) plus frontend changes and a critical external API dependency, all within a single PI with partial team availability. Achievable at 36 pts/sprint velocity across 8 sprints (~25–30 pt estimate from PI planning is plausible), but leaves little buffer for the Market Data API slip risk.
