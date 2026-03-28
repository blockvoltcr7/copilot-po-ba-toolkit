---
name: story-refiner
description: >
  Refine and improve draft user stories for sprint refinement prep. Use this
  skill when a Product Owner, BA, or Tech Lead says "refine this story",
  "improve this user story", "add acceptance criteria", "prep for refinement",
  "check this story", or has a draft story that needs better acceptance criteria,
  edge cases, sizing validation, or split recommendations. Also triggers when
  reviewing stories before a sprint refinement meeting.
license: MIT
---

# Story Refiner

Improve draft user stories to meet INVEST criteria with proper acceptance criteria, edge cases, and sizing.

## Input Options

1. **Pasted draft story** — raw text of a user story
2. **Jira story ID** — read from Jira MCP and refine in place
3. **Markdown file** — path to a story `.md` file (from epic-decomposer output)
4. **Multiple stories** — a file or pasted text with several stories to batch-refine

## Team Conventions

- **Sizing**: `1`, `2`, `3`, `5` only. If > 5, recommend split.
- **Priority**: `P1` through `P4`. No P0.
- **Acceptance criteria**: Given / When / Then format (mandatory).
- **Story types**: Story, Task, Spike, Bug.

## Workflow

1. **Read the draft story**
2. **Run the INVEST check** — score each criterion
3. **Improve acceptance criteria** — add/rewrite in Given/When/Then
4. **Identify edge cases** — negative scenarios, boundary conditions, error handling
5. **Flag vague language** — replace with specifics
6. **Validate sizing** — check if estimate matches complexity, recommend split if > 5
7. **Optionally explore codebase** — if the user provides a codebase path, add technical notes
8. **Present the refined story** — show original vs refined with a summary of changes

## INVEST Criteria Check

Score each criterion as Pass / Needs Work / Fail:

| Criterion | What to check |
|-----------|--------------|
| **I — Independent** | Can this story be developed and delivered without depending on incomplete stories? If blocked, are the blockers already done or in the same sprint? |
| **N — Negotiable** | Is the story flexible enough that the team can discuss implementation approach? If it prescribes a specific technical solution, flag it. |
| **V — Valuable** | Does the "so that" clause state a clear business or user benefit? "So that the system is updated" is NOT valuable. |
| **E — Estimable** | Is there enough detail for the team to estimate? If acceptance criteria are vague, it's not estimable. |
| **S — Small** | Can it be completed in one sprint? If estimated > 5 points, recommend splitting. |
| **T — Testable** | Can each acceptance criterion be verified with a concrete test? If not, rewrite it. |

Present the scorecard:
```
INVEST Check:
  I — Independent:  ✓ Pass
  N — Negotiable:   ✓ Pass
  V — Valuable:     ⚠ Needs Work — "so that" clause is vague
  E — Estimable:    ✓ Pass
  S — Small:        ✗ Fail — estimated at 8, recommend splitting
  T — Testable:     ⚠ Needs Work — AC #2 is not testable as written
```

## Vague Language Detection

Flag and replace these patterns:

| Vague | Replace with |
|-------|-------------|
| "should handle errors" | "Given [specific error], When [trigger], Then [specific behavior]" |
| "properly validated" | specific validation rules with examples |
| "user-friendly" | specific UX criteria (load time, click count, accessibility) |
| "performant" | specific metrics (response time < 200ms, handles 1000 concurrent) |
| "secure" | specific security measures (input sanitization, auth check, encryption) |
| "as needed" | specific conditions that trigger the behavior |
| "etc." | list all items explicitly |
| "similar to X" | specify exact behavior, don't reference other features |

## Sizing Validation

When checking the size estimate:

| Size | Typical scope | If the story is bigger... |
|------|--------------|--------------------------|
| **1** | Config change, copy update, simple bug fix | This is correct — trivial work |
| **2** | Small feature with clear pattern to follow, 1-2 files | Consider if there are hidden edge cases |
| **3** | Moderate feature, multiple files, some design decisions | Standard story size |
| **5** | Complex feature, multiple services, significant testing | At the limit — look for natural split points |
| **> 5** | **Must split.** | Identify 2-3 independent deliverables within the story |

### How to Split

When recommending a split, propose specific stories:

```
⚠ This story is estimated at 8 points. Recommend splitting into:

1. "[Original title] — API endpoint" (3 pts)
   - Backend logic and API contract
   - AC: [subset of original AC]

2. "[Original title] — UI implementation" (3 pts)
   - Frontend component and integration
   - AC: [subset of original AC]

3. "[Original title] — E2E testing and edge cases" (2 pts)
   - Integration tests and error handling
   - AC: [remaining AC + edge cases]
```

## Output Format

Present the refined story in this format:

```markdown
# [Story Title] (Refined)

## Changes Made
- [Summary of what was improved]
- [e.g., "Added 3 acceptance criteria in Given/When/Then format"]
- [e.g., "Flagged vague 'handle errors' — replaced with specific error scenarios"]
- [e.g., "Recommended split: original 8pts → two stories of 3pts + 5pts"]

## INVEST Score: [X/6 Pass]

## User Story
As a [role], I want [goal], so that [benefit].

## Acceptance Criteria
- **Given** [precondition], **When** [action], **Then** [expected result]
- **Given** [precondition], **When** [action], **Then** [expected result]
- **Given** [precondition], **When** [action], **Then** [expected result]

## Edge Cases
- [Specific negative scenario with expected behavior]
- [Boundary condition with expected behavior]
- [Error scenario with expected behavior]

## Technical Notes
- **Affected files/services**: [if codebase was analyzed]
- **Patterns to follow**: [if codebase was analyzed]

## Size
[1 | 2 | 3 | 5] — [reasoning]

## Priority
[P1 | P2 | P3 | P4]
```

## Critical Rules

- **Never accept vague acceptance criteria** — every AC must be testable with Given/When/Then. If the input has "it should work correctly," rewrite it.
- **Always provide at least 3 acceptance criteria** — if the story only has 1-2, add more based on the story's scope.
- **Always include at least 2 edge cases** — think about empty states, error conditions, boundary values, concurrent access.
- **Show your work** — always present the INVEST scorecard so the PO/Tech Lead can see what was improved.
- **Preserve the user's intent** — refine the story, don't rewrite it. Keep the original business goal intact.
- **Size 5 is the hard ceiling** — if a story can't be estimated at 5 or below after refinement, it must be split.

## Jira MCP Integration

When Jira MCP is available:
- Read the story directly from Jira by ticket ID
- After refinement, offer to update the Jira ticket with the refined description, acceptance criteria, and story points
- Add a comment noting what was refined

When Jira MCP is NOT available:
- Work from pasted text or markdown files
- Output the refined story as markdown for manual Jira update

## Batch Refinement

When refining multiple stories (e.g., before a sprint refinement meeting):

1. Read all stories
2. Refine each one
3. Present a summary table:

```
Sprint Refinement Prep — [X] stories refined

| # | Story | INVEST | Size | Issues Found | Action |
|---|-------|--------|------|-------------|--------|
| 1 | [title] | 6/6 ✓ | 3 | None | Ready |
| 2 | [title] | 4/6 ⚠ | 5 | Vague AC, no edge cases | Refined |
| 3 | [title] | 2/6 ✗ | 8 | Too large, no AC | Split into 3.a + 3.b |
```
