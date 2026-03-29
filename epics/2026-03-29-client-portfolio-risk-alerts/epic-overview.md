# Epic: Real-Time Portfolio Risk Alerts

## Business Context
Financial advisors currently review client portfolios quarterly, leaving risk drift undetected for weeks or months. FINRA is increasing scrutiny on suitability monitoring (Rule 2111), and the firm needs automated monitoring to demonstrate proactive risk management ahead of the next SEC examination cycle.

## Success Criteria
- Advisors receive automated alerts when client portfolio risk scores exceed stated tolerance
- Alert thresholds are configurable per client segment (conservative, moderate, aggressive)
- Complete audit trail of all alerts and advisor responses for compliance reporting
- System monitors all account types (individual, joint, trust, IRA, 401k rollovers)

## Story Map

| # | Story | Type | Size | Priority | Dependencies | Status |
|---|-------|------|------|----------|-------------|--------|
| 1.0 | Setup risk monitoring engine | Task | 3 | P1 | — | To Do |
| 1.1 | Real-time risk calculation service | Story | 3 | P1 | 1.0 | To Do |
| 1.2 | Spike: Evaluate risk scoring models | Spike | 2 | P1 | — | To Do |
| 2.0 | Alert threshold configuration | Story | 3 | P2 | 1.1 | To Do |
| 2.1 | Advisor dashboard risk alert widget | Story | 5 | P1 | 1.1 | To Do |
| 2.2 | Notification delivery channels | Story | 3 | P2 | 2.1 | To Do |
| 3.0 | Compliance audit trail | Story | 5 | P2 | 1.1 | To Do |
| 3.1 | Integration testing E2E | Task | 3 | P3 | 2.1, 2.2 | To Do |
| 3.2 | Documentation and runbook | Task | 1 | P4 | 3.1 | To Do |

## Sizing Summary
- **Total stories**: 9
- **Total estimated points**: 28
- **Spikes to resolve first**: 1 (1.2)
- **Critical path**: 1.0 → 1.1 → 2.1 → 2.2 → 3.1 → 3.2

## Risks
- FINRA suitability requirements need legal review before AC finalization
- Market data API contract renewal pending — dependency for real-time risk scoring
- Compliance team availability for UAT limited to Sprints 4-5

## Notes for PI Planning
- **Recommended sprint allocation**: Spike 1.2 in Sprint 1, core stories Sprints 2-4, testing Sprint 5, docs Sprint 6
- **Team dependencies**: Compliance team needed for UAT of story 3.0
