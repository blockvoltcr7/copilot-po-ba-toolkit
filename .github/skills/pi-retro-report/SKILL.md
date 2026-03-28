---
name: pi-retro-report
description: >
  Generate a structured PI retrospective report from unstructured retro notes.
  Use this skill when a Scrum Master, Tech Lead, or Product Owner says "generate
  retro report", "create PI retrospective", "summarize the retro", "retro notes
  to report", or has raw retrospective notes that need to be turned into a
  professional document for leadership. Produces a Word document or PowerPoint
  using the existing document generation skills.
license: MIT
---

# PI Retrospective Report Generator

Turn raw retro notes into a structured, professional report for leadership.

## Input Options

1. **Pasted retro notes** — raw text from a retro session (Miro board export, meeting notes, etc.)
2. **Markdown file** — path to a file with retro notes
3. **Multiple inputs** — notes from several retro sessions within the same PI

## Workflow

1. **Read the retro notes**
2. **Categorize findings** — sort into What Went Well, What Didn't, Action Items
3. **Identify themes** — group related items into themes
4. **Extract metrics** — pull any quantitative data mentioned (velocity, defects, carryover)
5. **Generate the report** — using the docx-generator or pptx-generator skill
6. **Save to** `generated/output/pi-retro-YYYY-MM-DD.docx` (or `.pptx`)

## Report Structure

### For Word Document (docx)

Generate a script using the **docx-generator** skill patterns. The document should contain:

```
1. Cover Page
   - Title: "PI [X.X] Retrospective Report"
   - Team name, PI dates, report date

2. Executive Summary
   - 2-3 sentence overview of the PI
   - Overall health: [Strong / Steady / Needs Attention]
   - Top 3 wins and top 3 concerns

3. Metrics Summary (table)
   | Metric | Target | Actual | Trend |
   - Velocity (avg story points per sprint)
   - Sprint completion rate
   - Carryover stories count
   - Defects found / fixed
   - PI objective completion rate

4. What Went Well
   - Grouped by theme (e.g., "Collaboration", "Technical", "Process")
   - Each item as a bullet point with context

5. What Didn't Go Well
   - Grouped by theme
   - Each item with impact description

6. Action Items
   | Action | Owner | Deadline | Priority | Status |
   - Specific, measurable actions
   - Each must have an owner and deadline

7. Themes & Trends
   - Recurring patterns across sprints or PIs
   - "This is the 3rd PI where [X] was raised"

8. Recommendations for Next PI
   - 3-5 specific recommendations based on findings
   - Tied to action items where applicable
```

### For PowerPoint (pptx)

Generate a script using the **pptx-generator** skill patterns. The deck should contain:

```
Slide 1 — Title: "PI [X.X] Retrospective"
Slide 2 — Executive Summary (3 wins, 3 concerns)
Slide 3 — Metrics Dashboard (KPI cards with conditional colors)
Slide 4 — What Went Well (grouped by theme, 2-column layout)
Slide 5 — What Didn't Go Well (grouped by theme)
Slide 6 — Action Items (table with owner, deadline, priority)
Slide 7 — Trends (what keeps recurring across PIs)
Slide 8 — Recommendations for Next PI
```

## Categorization Rules

When categorizing raw notes:

### What Went Well
Items that describe positive outcomes, successful practices, or things to continue.
- Keywords: "great", "improved", "loved", "keep doing", "worked well", "success"

### What Didn't Go Well
Items that describe problems, frustrations, or areas needing improvement.
- Keywords: "frustrated", "slow", "blocked", "failed", "unclear", "too much", "missed"

### Action Items
Items that describe something the team should DO differently.
- Must be converted to: specific action + owner + deadline
- Keywords: "we should", "let's", "need to", "action", "next time", "going forward"

### Ambiguous Items
If an item could be either category, classify based on tone:
- If it describes a past event → What Went Well or What Didn't
- If it describes a future action → Action Item
- If unclear, put in What Didn't Go Well with a note "(needs clarification)"

## Critical Rules

- **Every action item MUST have an owner and deadline** — "Improve our testing process" is not an action item. "John will set up automated regression suite by Sprint 2 of next PI" is.
- **Group by themes, not by person** — retros should feel collaborative, not like blame sessions.
- **Include metrics even if approximate** — if the notes don't have exact numbers, note them as "estimated" or put "N/A" with a note to fill in.
- **Flag recurring themes** — if the same issue appears in multiple retros, call it out explicitly. This signals systemic issues to leadership.
- **Keep the tone constructive** — reframe negative items as opportunities. "Deployments kept breaking" → "Deployment reliability needs improvement — recommend adding staging environment validation."

## Output

Save generator scripts to `generated/scripts/` and output files to `generated/output/` per project conventions.

After generating, tell the user:
> "PI Retro report saved to `generated/output/pi-retro-YYYY-MM-DD.docx`.
> [X] items categorized: [Y] went well, [Z] didn't, [W] action items.
> [N] recurring themes identified across PIs."
