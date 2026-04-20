# Command Templates

When the user's request maps to one of these workflows, follow the corresponding template below.

---

## generate-web-diagram

**Trigger:** User asks for a diagram, visualization, or chart on any topic.

Generate an HTML diagram for the requested topic. Follow the visual-explainer SKILL.md workflow. Read the relevant template from `./assets/` and css-patterns.md before generating. Pick a distinctive aesthetic — vary fonts, palette, and layout from previous diagrams.

If `surf` CLI is available (`which surf`), consider generating an AI illustration via `surf gemini --generate-image` when an image would genuinely enhance the page — hero banner, conceptual illustration, or educational diagram Mermaid can't express. Skip for purely structural/data-driven topics.

Write to `./` and open in browser.

---

## generate-visual-plan

**Trigger:** User asks to visualize a feature plan, implementation spec, or "how should we build X."

**Data gathering phase:**
1. Parse the feature request — extract core problem, desired behavior, constraints, scope
2. Read relevant codebase files — identify files to modify, existing patterns, types/APIs to conform to
3. Understand extension points — hooks, event systems, plugin architectures, config options
4. Check for prior art — similar features, related issues, reusable code

**Design phase (work through before writing HTML):**
1. State design — what new state is needed? What's affected?
2. API design — commands, functions, endpoints, error cases
3. Integration design — how does this interact with existing functionality?
4. Edge cases — concurrent operations, errors, boundary values

**Verification checkpoint** — produce a fact sheet before writing HTML:
- Every state variable (new and modified) with type and purpose
- Every function/command/API with signature
- Every file needing modification with specific changes
- Every edge case with expected behavior
- Every assumption about the codebase

**Diagram structure:**
1. Header — feature name, one-line description, scope summary
2. The Problem — side-by-side panels: current behavior vs desired behavior (concrete examples)
3. State Machine — Mermaid flowchart of states and transitions (use `flowchart TD` if labels need special chars)
4. State Variables — card grid showing new and modified state (with code blocks)
5. Modified Functions — file path + key snippet (10–20 lines) + explanation per function
6. Commands / API — table: name, parameters, behavior
7. Edge Cases — table: scenario, expected behavior
8. Test Requirements — table/grid: test categories and specific tests to add
9. File References — table: file → changes needed
10. Implementation Notes — callout boxes for backward compat, warnings, performance

Use hero depth for sections 1–3, elevated for 4–6, flat/recessed for 7–10. Use `white-space: pre-wrap` on all code blocks.

Write to `./` with filename like `feature-name-plan.html`. Open in browser.

---

## generate-slides

**Trigger:** User explicitly requests a slide deck, invokes `/generate-slides`, or passes `--slides` to another workflow.

**IMPORTANT: Never auto-select slide format.** Only generate slides when explicitly requested.

Read `./assets/slide-deck.html` and `./references/slide-patterns.md` before generating. Also read `./references/css-patterns.md` and `./references/libraries.md`.

**Planning process (required before writing HTML):**
1. Inventory the source — enumerate every section, table, decision, specification, collapsible detail
2. Map source to slides — every item must appear somewhere; if 6 decisions exist, all 6 need slides
3. Choose layouts — assign a composition (centered, left-heavy, split, full-bleed) per slide
4. Plan images — check `which surf`; if available, plan 2–4 images (title background + full-bleed at minimum)
5. Verify coverage before writing HTML — count planned slides vs source items

**Aesthetic:** Pick from the 4 slide presets in slide-patterns.md (Midnight Editorial, Warm Signal, Terminal Mono, Swiss Clean) or adapt the 8 aesthetic directions for slides. Commit to one.

**Narrative arc:** Impact (title) → Context (overview) → Deep dive (content, diagrams, data) → Resolution (summary/next steps).

**Rules:**
- Consecutive slides must vary spatial approach (centered, left-heavy, split, edge-aligned, full-bleed)
- Each slide is exactly 100dvh — never scroll within a slide
- Minimum body text: 16px. Typography is 2–3× larger than scrollable pages.
- Mermaid diagrams: max 8–10 nodes, 18px+ labels — use CSS Pipeline for simple linear flows

Write to `./` and open in browser.

---

## diff-review

**Trigger:** User asks to review a git diff, branch comparison, PR, or code change.

**Scope detection from argument:**
- Branch name → working tree vs that branch
- Commit hash → `git show <hash>`
- `HEAD` → `git diff` + `git diff --staged`
- PR number (e.g. `#42`) → `gh pr diff 42`
- Range (`abc..def`) → diff between commits
- No argument → default to `main`

**Data gathering phase:**
- `git diff --stat <ref>` — file-level overview
- `git diff --name-status <ref>` — new/modified/deleted files
- Line counts: compare key files between ref and working tree
- Grep added lines for exported symbols, public functions, classes
- Feature inventory: grep for new actions, config fields, event types
- Read all changed files in full
- Check CHANGELOG.md for an entry; check README.md / docs for needed updates
- Mine conversation history for decision rationale

**Verification checkpoint** — produce a fact sheet of every claim you will present:
- Every quantitative figure: line counts, file counts, function counts, test counts
- Every function, type, module name you will reference
- Every behavior description: what changed, before vs after
- Cite the source for each claim; mark unverifiable claims as uncertain

**Diagram structure:**
1. Executive summary — *why* do these changes exist? What problem? What insight? (hero depth)
2. KPI dashboard — lines +/-, files changed, new modules, test counts, CHANGELOG badge, docs badge
3. Module architecture — Mermaid dependency graph of current state (zoom controls required)
4. Major feature comparisons — side-by-side before/after panels per significant area
5. Flow diagrams — Mermaid flowchart/sequence for new lifecycles or pipelines (zoom controls)
6. File map — color-coded new/modified/deleted tree (use `<details>` collapsed by default)
7. Test coverage — before/after test file counts and coverage
8. Code review — Good / Bad / Ugly / Questions (green/red/amber/blue border cards)
9. Decision log — cards per design decision: Decision, Rationale, Alternatives, Confidence level
10. Re-entry context — Key invariants, Non-obvious coupling, Gotchas, Don't-forget follow-ups

Sections 1–3 hero depth; sections 6+ flat/recessed. Use diff color language: red=removed, green=added, yellow=modified, blue=neutral.

Include responsive section navigation (read `./references/responsive-nav.md`).

Write to `./` and open in browser. Ultrathink.

---

## plan-review

**Trigger:** User asks to review a plan document against the actual codebase.

**Inputs:** Plan file path (arg 1), codebase path (arg 2, or current directory).

**Data gathering phase:**
1. Read the plan file in full — problem statement, each proposed change, rejected alternatives, scope boundaries
2. Read every file the plan references, plus their importers/dependents
3. Map the blast radius — what imports affected files, what tests exist, what config/types need updates
4. Cross-reference plan vs code — does each referenced file/function actually exist? Does the plan's description of current behavior match the code?

**Verification checkpoint** — fact sheet before writing HTML:
- Every quantitative figure, every function/type/module name from plan and codebase
- Every behavior description: current vs proposed
- Cite source (plan section or file:line) for each; mark uncertain claims

**Diagram structure:**
1. Plan summary — *what problem does this solve? What's the core insight?* Then scope: files, scale, new modules (hero depth)
2. Impact dashboard — files to modify/create/delete, estimated lines, test files planned, completeness indicator (tests/docs/migration coverage)
3. Current architecture — Mermaid of affected subsystem *today* (zoom controls required)
4. Planned architecture — Mermaid *after* implementation — same node names/layout for visual diff (highlight new/removed/changed)
5. Change-by-change breakdown — side-by-side panels: current code vs plan proposal + rationale + flag discrepancies
6. Dependency & ripple analysis — table/graph: callers and downstream effects; color-code covered/uncovered/missed
7. Risk assessment — edge cases not addressed, assumptions, ordering risks, rollback complexity, cognitive complexity flags
8. Plan review — Good / Bad / Ugly / Questions (same card pattern as diff-review)
9. Understanding gaps — roll up: changes with/without rationale, cognitive complexity flags, recommendations

Sections 1–4 hero/elevated; sections 6+ flat/recessed. Current state = blue/neutral; planned = green; concern = amber; gap = red.

Include responsive section navigation. Write to `./` and open in browser. Ultrathink.

---

## project-recap

**Trigger:** User asks for a project recap, mental model snapshot, or "catch me up on this project."

**Time window from argument:**
- `2w`, `30d`, `3m` → parse to git `--since` format
- No argument or non-time-pattern → default to `2w`

**Data gathering phase:**
1. Project identity — read README, CHANGELOG, package.json / pyproject.toml / go.mod
2. Recent activity — `git log --oneline --since=<window>`, `git log --stat`, `git shortlog -sn`
3. Current state — `git status` (uncommitted), `git branch --no-merged` (stale branches), TODO/FIXME in recent files, progress docs
4. Decision context — recent commit messages, conversation history, plan docs, RFCs, ADRs
5. Architecture scan — read entry points, public API surface, most frequently changed files

**Verification checkpoint** — fact sheet before writing HTML:
- Every quantitative figure: commit counts, file counts, line counts, branch counts
- Every module, function, type name referenced
- Cite git command output or file:line for each; mark uncertain claims

**Diagram structure:**
1. Project identity — current-state summary: what it does, who uses it, what stage, version, key deps, elevator pitch
2. Architecture snapshot — Mermaid of system as it exists today (hero depth, zoom controls required)
3. Recent activity — human-readable narrative grouped by theme (features, bugs, refactors, infra); timeline visualization
4. Decision log — key design decisions from the window: what decided, why, what was considered
5. State of things — KPI cards: working / in-progress / broken / blocked (with trend indicators)
6. Mental model essentials — 5–10 things needed to work on this project: key invariants, non-obvious coupling, gotchas, naming conventions
7. Cognitive debt hotspots — amber cards with severity: undocumented rationale, complex untested modules, overlapping changes
8. Next steps — inferred from activity, open TODOs, trajectory

Include responsive section navigation. Write to `./` and open in browser. Ultrathink.

---

## fact-check

**Trigger:** User asks to verify a visual explainer page or document for accuracy against the actual codebase.

**Target file from argument:**
- Explicit path → verify that file
- No argument → most recently modified `.html` in the project root (`./`)

Auto-detect document type and adjust verification:
- HTML review pages → verify against the git ref or plan file it was based on
- Plan/spec markdown → verify file references, function/type names, behavior claims
- Any document → extract and verify whatever factual claims about code it contains

**Phase 1: Extract claims** — read the file, extract every verifiable claim:
- Quantitative: line counts, file counts, function counts, test counts, numeric metrics
- Naming: function names, type names, module names, file paths
- Behavioral: descriptions of what code does, before/after comparisons
- Structural: architecture claims, dependency relationships, import chains
- Temporal: git history claims, commit attributions, timeline entries

**Phase 2: Verify** — go to the source for each claim:
- Re-read every referenced file; check signatures/types/behavior vs actual code
- Re-run git commands for git history claims
- For diff-reviews: read both ref version and working tree to check before/after aren't swapped

Classify: **Confirmed** (matches exactly) | **Corrected** (was wrong — note what changed) | **Unverifiable** (can't be checked)

**Phase 3: Correct in place** — edit the file with surgical replacements:
- Fix incorrect numbers, function names, file paths, behavior descriptions
- Fix before/after swaps (common error class)
- Preserve layout, CSS, animations, Mermaid structure (unless labels have factual errors)

**Phase 4: Add verification summary** — insert at top (HTML) or append (markdown):
- Total claims checked
- Confirmed count
- Corrections made (brief list: what was fixed and where)
- Unverifiable claims flagged

**Phase 5: Report** — tell user what was checked and corrected; open file in browser.

Write corrections to the original file. This is a fact-checker only — it does not change analysis, opinions, or document structure. Ultrathink.

---

## share

**Trigger:** User asks to share, deploy, or publish a visual explainer HTML page.

```bash
bash <skill-dir>/scripts/share.sh <html-file>
```

**Example:**
```bash
bash .github/skills/visual-explainer/scripts/share.sh ./my-diagram.html

```

**Requirements:** vercel-deploy skill must be installed.

**Output:**
```
✓ Shared successfully!
Live URL:  https://skill-deploy-abc123.vercel.app
Claim URL: https://vercel.com/claim-deployment?code=...
```

**Notes:**
- Deployments are public — anyone with the URL can view
- Preview deployments have 30-day default retention
- Claim URL lets you transfer the deployment to a Vercel account
