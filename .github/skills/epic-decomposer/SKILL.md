---
name: epic-decomposer
description: >
  Decompose a feature brief or business requirement into structured epics,
  user stories, tasks, and spikes ready to push to Jira. Use this skill when
  a Product Owner or Tech Lead says "break this into epics", "decompose this
  feature", "create stories from this brief", "build out the epic", or has a
  feature brief and needs it turned into actionable work items with acceptance
  criteria, sizing, and priorities. Also use when the user wants to push
  structured work items to Jira via MCP.
license: MIT
---

# Epic Decomposer

Break feature briefs into structured epic folders with user stories, tasks, and spikes — ready for Jira.

## Input Options

1. **Feature brief file** — markdown file from the feature-brief-generator skill (preferred)
2. **Pasted requirements** — business requirement or feature description pasted directly
3. **Jira epic ID** — read the epic from Jira MCP and decompose into stories

## Team Conventions

These conventions MUST be followed — they match the team's SAFe process:

- **Sizing**: Fibonacci subset — `1`, `2`, `3`, `5` only. Never use 8 or 13. If estimated > 5, recommend splitting.
- **Priority**: `P1` (critical), `P2` (high), `P3` (medium), `P4` (low). Never use P0.
- **Sprint length**: 2 weeks (always)
- **Story types**: `Story`, `Task`, `Spike`, `Bug`
- **Acceptance criteria format**: Given / When / Then

## Workflow

1. **Read the input** — feature brief, pasted text, or Jira epic via MCP
2. **Identify the epic boundary** — what is one coherent epic vs what needs multiple epics
3. **Decompose into stories** — break down into user stories, tasks, and spikes
4. **Write acceptance criteria** — Given/When/Then for each story
5. **Assign sizing and priority** — using team conventions
6. **Map dependencies** — identify which stories block others
7. **Generate the epic folder** — create all files
8. **Present the story map** — show the summary table for review

## Output Structure

Generate an epic folder at `epics/YYYY-MM-DD-feature-name/`:

```
epics/2026-03-28-portfolio-recommendations/
├── epic-overview.md
├── 1.0-setup-recommendation-engine.md
├── 1.1-add-recommendation-api-endpoint.md
├── 1.2-spike-evaluate-ml-models.md
├── 2.0-build-advisor-dashboard-widget.md
├── 2.1-add-client-preference-settings.md
├── 3.0-integration-testing-e2e.md
└── 3.1-documentation-and-runbook.md
```

## Epic Overview Template

```markdown
# Epic: [Epic Title]

## Business Context
[2-3 sentences from the feature brief. Why this epic exists.]

## Success Criteria
- [Measurable outcome 1 — e.g., "Advisors can view AI-generated portfolio recommendations"]
- [Measurable outcome 2 — e.g., "Recommendation accuracy > 85% on backtested data"]

## Story Map

| # | Story | Type | Size | Priority | Dependencies | Status |
|---|-------|------|------|----------|-------------|--------|
| 1.0 | Setup recommendation engine | Task | 3 | P1 | — | To Do |
| 1.1 | Add recommendation API endpoint | Story | 3 | P1 | 1.0 | To Do |
| 1.2 | Spike: Evaluate ML models | Spike | 2 | P1 | — | To Do |
| 2.0 | Build advisor dashboard widget | Story | 5 | P2 | 1.1 | To Do |
| 2.1 | Add client preference settings | Story | 3 | P2 | 2.0 | To Do |
| 3.0 | Integration testing E2E | Task | 3 | P3 | 2.0, 2.1 | To Do |
| 3.1 | Documentation and runbook | Task | 1 | P4 | 3.0 | To Do |

## Sizing Summary
- **Total stories**: [X]
- **Total estimated points**: [X]
- **Spikes to resolve first**: [X] ([list spike numbers])
- **Critical path**: [sequence of stories that determines minimum timeline]

## Risks
[From feature brief — technical risks, dependencies, open questions that affect this epic.]

## Notes for PI Planning
- **Recommended sprint allocation**: [e.g., "Spikes in Sprint 1, core stories Sprints 2-3, testing Sprint 4"]
- **Team dependencies**: [Any cross-team dependencies]
```

## User Story Template

Each numbered `.md` file follows this template:

```markdown
# [Number] [Story Title]

## User Story
As a [role], I want [goal], so that [benefit].

## Acceptance Criteria
- **Given** [precondition], **When** [action], **Then** [expected result]
- **Given** [precondition], **When** [action], **Then** [expected result]
- **Given** [precondition], **When** [action], **Then** [expected result]

## Edge Cases
- [Negative scenario 1 — e.g., "User submits empty form"]
- [Negative scenario 2 — e.g., "API returns timeout after 30s"]
- [Boundary condition — e.g., "Portfolio with 0 holdings"]

## Technical Notes
- **Affected files/services**: [specific paths from feature brief]
- **Patterns to follow**: [existing patterns identified in codebase]
- **API changes**: [new endpoints, modified contracts, etc.]

## Size
[1 | 2 | 3 | 5] — [one-line reasoning]

## Priority
[P1 | P2 | P3 | P4]

## Type
[Story | Task | Spike | Bug]

## Dependencies
- **Blocked by**: [story numbers, or "None"]
- **Blocks**: [story numbers, or "None"]

## Definition of Done
- [ ] Code complete with unit tests
- [ ] Acceptance criteria verified
- [ ] Code reviewed and approved
- [ ] Documentation updated (if applicable)
- [ ] No regressions in existing tests
```

## Spike Template

For spike/research stories, use this variation:

```markdown
# [Number] Spike: [Research Question]

## Objective
[What we need to learn or decide. 1-2 sentences.]

## Research Questions
1. [Specific question to answer]
2. [Specific question to answer]
3. [Specific question to answer]

## Timebox
[1 | 2 | 3 | 5] points — [X days maximum]

## Expected Output
- [ ] Written findings document with recommendation
- [ ] Proof of concept (if applicable)
- [ ] Decision recorded in [Jira ticket / Confluence / ADR]

## Priority
[P1 | P2 | P3 | P4]

## Type
Spike

## Dependencies
- **Blocked by**: [story numbers, or "None"]
- **Blocks**: [story numbers — spikes typically block implementation stories]
```

## Critical Rules

- **Never exceed size 5** — if a story feels bigger than 5, split it into smaller stories. Always.
- **Every story needs at least 3 acceptance criteria** — if you can't write 3, the story is too vague or too small.
- **Spikes must have a timebox** — never create an open-ended spike. Always specify a point estimate and max days.
- **Dependencies must be explicit** — every story that depends on another must list it. This drives sprint planning order.
- **Given/When/Then is mandatory** — never use informal acceptance criteria like "it should work correctly."
- **Number stories hierarchically** — `1.0` is the parent, `1.1`, `1.2` are related sub-stories. `2.0` starts a new group.
- **Include at least one edge case per story** — forces the team to think about error handling and boundary conditions.
- **Technical Notes must reference real code** — if a feature brief with codebase analysis was provided, carry the specific file paths and patterns forward.

## Jira MCP Integration

When Jira MCP is available, after generating the epic folder:
- Offer to create the epic in Jira using the MCP tools
- Create each story/task as a Jira issue linked to the epic
- Set priority, story points, and dependencies
- Use the epic-overview.md as the epic description

When Jira MCP is NOT available:
- Generate the epic folder locally
- Tell the user they can push to Jira manually or when MCP is available

## After Decomposition

Tell the user:

> "Epic folder created at `epics/YYYY-MM-DD-feature-name/` with [X] stories totaling [Y] points.
>
> Next steps:
> - Review the stories and adjust sizing/priority
> - Use the **story-refiner** skill to polish individual stories before refinement
> - Push to Jira when ready (via Jira MCP or manually)
> - Use the **pi-planning-workbook** skill to map these stories to sprints"
