---
name: feature-brief-generator
description: >
  Generate a structured feature brief from a vague business requirement.
  Use this skill when a Product Owner or Tech Lead has an Aha! requirement,
  Jira ticket, or pasted business description and needs a structured feature
  brief with technical analysis from the codebase. Trigger when the user says
  "generate a feature brief", "analyze this requirement", "what would it take
  to build this", or provides a business requirement and asks for technical
  context or decomposition prep.
license: MIT
---

# Feature Brief Generator

Turn vague business requirements into structured, actionable feature briefs with technical context from the codebase.

## Input Options

The user will provide requirements in one of these ways:

1. **Pasted text** — Aha! requirement or business description pasted directly into the prompt
2. **Markdown file** — path to a `.md` or `.txt` file containing the requirement
3. **Jira ticket** — Jira ticket ID (e.g., `PROJ-1234`); use the Jira MCP server tools to read the ticket details. If Jira MCP is not available, ask the user to paste the ticket contents instead.

The user may also provide a **codebase path** — a directory or repo to analyze for technical context. If not provided, use the current working directory.

## Workflow

1. **Read the requirement** — from pasted text, file, or Jira MCP
2. **Explore the codebase** — identify affected systems, key files, existing patterns, architecture
3. **Draft the feature brief** — using the template below
4. **Present to user for review** — ask if any sections need adjustment
5. **Save the brief** — to `docs/feature-briefs/YYYY-MM-DD-feature-name.md`

## Feature Brief Template

Generate the following markdown document:

```markdown
# Feature Brief: [Feature Name]

## Source
- **Origin**: [Aha! / Jira ticket ID / Verbal requirement]
- **Date**: [YYYY-MM-DD]
- **Author**: [PO name + Tech Lead name if known]
- **Status**: Draft

---

## Business Context

### What the Business Wants
[Restate the requirement in clear terms. Remove ambiguity. 2-3 sentences.]

### Business Value
[Why this matters. Revenue impact, user impact, compliance driver, etc.]

### Target Users / Personas
[Who benefits from this feature. Be specific — "financial advisors managing 200+ client portfolios" not "users".]

---

## Technical Analysis

### Affected Systems / Services
[List the services, modules, or systems that would need changes.]

| System/Service | Type of Change | Complexity |
|---------------|---------------|------------|
| [service-name] | [New / Modify / Integrate] | [S/M/L/XL] |

### Key Files & Modules
[List specific files, directories, or modules identified from the codebase scan.]

- `path/to/file.ts` — [what it does, why it's affected]
- `path/to/module/` — [what it does, why it's affected]

### Existing Patterns to Follow
[Identify patterns in the codebase that this feature should follow for consistency.]

- [Pattern 1: e.g., "All API endpoints use the BaseController pattern in src/controllers/"]
- [Pattern 2: e.g., "Data validation uses Zod schemas co-located with route handlers"]

### Current Architecture (Relevant)
[Brief description of how the current system works in the area this feature touches. 2-4 sentences. Reference specific code if helpful.]

---

## Scope & Boundaries

### In Scope
- [Specific deliverable 1]
- [Specific deliverable 2]
- [Specific deliverable 3]

### Out of Scope
- [Explicitly excluded item 1]
- [Explicitly excluded item 2]

### Assumptions
- [Assumption 1 — e.g., "Existing auth system supports the required role-based access"]
- [Assumption 2 — e.g., "Third-party API rate limits are sufficient for projected volume"]

---

## Risks & Dependencies

### Technical Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk description] | [Low/Med/High] | [Low/Med/High] | [Mitigation strategy] |

### External Dependencies
- [Dependency 1 — e.g., "Requires API access from vendor X (pending contract)"]
- [Dependency 2 — e.g., "Blocked by Team Y's auth service migration"]

### Data & Migration Concerns
[Any data migration, schema changes, or backward compatibility concerns. "None identified" if clean.]

---

## Open Questions

### Needs PO Clarification
- [ ] [Question 1 — e.g., "Should inactive accounts be included in the report?"]
- [ ] [Question 2]

### Needs Architecture Review
- [ ] [Question 1 — e.g., "Should this be a new microservice or extend the existing API?"]

### Needs Stakeholder Input
- [ ] [Question 1 — e.g., "Is the Q2 deadline firm or flexible?"]

---

## Recommended Approach

[1-2 paragraphs describing the high-level technical approach. Not implementation details — just the strategy. E.g., "Extend the existing portfolio-service to add a new /recommendations endpoint. Use the existing rule engine pattern for recommendation logic. Add a new Kafka consumer for real-time market data updates."]

### Complexity Estimate
- **Overall**: [S / M / L / XL]
- **Reasoning**: [1 sentence — e.g., "M — modifies 2 existing services with well-defined patterns, no new infrastructure needed"]
```

## Critical Rules

- **Always explore the codebase** — never generate a feature brief without scanning the relevant code. The Technical Analysis section must reference real files and patterns, not generic placeholders.
- **Flag unknowns explicitly** — if you can't determine something from the codebase or requirement, put it in Open Questions. Never guess at business logic.
- **Keep it actionable** — every section should help the PO and Tech Lead make a decision or take a next step. Remove fluff.
- **Scope boundaries are mandatory** — explicitly stating what's out of scope prevents scope creep during PI planning.
- **Use the user's language** — mirror the terminology from the Aha!/Jira requirement. Don't rename concepts.

## Jira MCP Integration

When Jira MCP is available, the agent can:
- Read ticket details: use the Jira MCP tools to fetch the epic or story description, status, and linked issues
- Read comments and attachments for additional context
- Identify related tickets in the same epic or project

When Jira MCP is NOT available:
- Ask the user to paste the requirement text or provide a markdown file
- Note in the Source section that the requirement was provided manually

## After the Feature Brief

The feature brief is input to the **epic-decomposer** skill. Tell the user:

> "Feature brief saved to `docs/feature-briefs/YYYY-MM-DD-feature-name.md`.
> Ready to decompose into epics and user stories? You can run the epic-decomposer
> skill with this brief as input."
