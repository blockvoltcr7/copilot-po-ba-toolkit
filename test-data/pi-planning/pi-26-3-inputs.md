# PI 26.3 Planning Inputs

## PI Details
- **PI**: 26.3
- **Start Date**: May 4, 2026
- **End Date**: Aug 21, 2026
- **Sprints**: 8 (two-week)
- **Team**: Portfolio Services (Mustangs)

## Team Members

| Name | Role | Notes |
|------|------|-------|
| Sami Sabir-Idrissi | Tech Lead | Full availability |
| Lisa Park | Senior Backend Engineer | On vacation Sprint 3 (50% availability) |
| Mike Rodriguez | Senior Backend Engineer | Full availability |
| Sarah Kim | Frontend Engineer | Full availability |
| James Wright | Full-Stack Engineer | On-call rotation Sprint 1 and Sprint 5 (75% availability) |
| Priya Patel | QA Engineer | Full availability |
| Chen Wei | Junior Backend Engineer | Ramping up - 75% velocity first 2 sprints |

**Historical Velocity**: 36 points/sprint (PI 26.2 average)

## Features to Plan

### Feature 1: Real-Time Portfolio Risk Alerts (from Aha! WEALTH-2847)
- Priority: P1
- Estimated total: ~25-30 points
- Dependencies: Market Data Service team (API ready Sprint 2)
- Includes: risk calculation engine, advisor dashboard alerts, notification service

### Feature 2: Client Onboarding Document Automation
- Priority: P2
- Estimated total: ~18-22 points
- Dependencies: None
- Includes: document generation, e-signature integration, compliance checklist automation

### Feature 3: Portfolio Performance Reporting Enhancements
- Priority: P2
- Estimated total: ~15-18 points
- Dependencies: Data Warehouse team (new tables ready Sprint 1)
- Includes: new report templates, benchmark comparison, PDF export

### Feature 4: Tech Debt — Migrate Legacy Risk Calculator to New Architecture
- Priority: P3
- Estimated total: ~12-15 points
- Dependencies: None (internal)
- Includes: refactor legacy code, add test coverage, deprecate old endpoints

### Feature 5: Advisor Mobile App — Push Notification Foundation
- Priority: P3
- Estimated total: ~10-12 points
- Dependencies: Mobile Platform team (SDK ready Sprint 3)
- Includes: notification service setup, iOS/Android integration, preference management

## PI Objectives (Draft)

1. Deliver real-time portfolio risk alerts to production (Business Value: 9)
2. Automate 80% of client onboarding document workflow (Business Value: 8)
3. Launch enhanced portfolio performance reports (Business Value: 7)
4. Reduce legacy risk calculator tech debt by 50% (Business Value: 5)
5. Foundation for mobile push notifications deployed (Business Value: 6)

## Known Risks
- Market Data Service API may slip — Team lead said "Sprint 2 at the earliest"
- New FINRA guidelines on AI-assisted recommendations expected Q3 — may impact Feature 1
- Chen Wei is new — velocity assumptions might be optimistic
- Team burned out from PI 26.2 carryover — need buffer
