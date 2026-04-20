---
name: visual-explainer
description: >
  Generate beautiful, self-contained HTML pages that visually explain systems, code changes,
  plans, and data. Use when the user asks for a diagram, architecture overview, diff review,
  plan review, project recap, comparison table, slide deck, or any visual explanation of
  technical concepts. Also use proactively when about to render a complex ASCII table
  (4+ rows or 3+ columns) — present it as a styled HTML page instead. Never fall back to
  ASCII art when this skill is loaded.
---

# Visual Explainer

Generate self-contained HTML files for technical diagrams, visualizations, slide decks, and data tables. Always open the result in the browser.

**Proactive table rendering.** When about to present tabular data as ASCII in the terminal (4+ rows or 3+ columns), generate an HTML table instead — don't wait for the user to ask.

## Commands

Read `./references/commands.md` to find the right workflow template when the user's request matches one of these:

| Intent | Command template |
|--------|-----------------|
| General diagram / visualization | `generate-web-diagram` |
| Feature implementation plan | `generate-visual-plan` |
| Slide deck presentation | `generate-slides` |
| Git diff review | `diff-review` |
| Plan vs codebase review | `plan-review` |
| Project state recap | `project-recap` |
| Verify a document vs code | `fact-check` |
| Deploy HTML to Vercel | `share` |

## Workflow

### 1. Think (pick direction before writing HTML)

**Who is looking?** Developer, PM, stakeholder? Shapes information density.

**What type?** Architecture, flowchart, sequence, ER, state machine, mind map, class diagram, C4, data table, timeline, dashboard, slide deck, or prose page.

**What aesthetic?** Pick one and commit. Constrained aesthetics are safer:
- **Blueprint** — technical drawing feel, deep slate/blue, monospace labels, subtle grid background
- **Editorial** — serif headlines (Instrument Serif / Crimson Pro), generous whitespace, muted earth tones
- **Paper/ink** — warm cream `#faf7f5`, terracotta/sage accents, informal
- **Terminal Mono** — green/amber on near-black, monospace everything

Flexible (require discipline): IDE themes (Dracula, Nord, Catppuccin, Gruvbox) — commit to the actual palette.

**Forbidden:** Neon dashboard (cyan+magenta+purple), gradient mesh (pink/purple/cyan blobs), Inter font + violet/indigo accents + gradient text.

Vary the choice each time. If last was dark+technical, make next light+editorial.

### 2. Structure

**Read the right reference before generating:**
- Text-heavy architecture cards → `./assets/architecture.html`
- Flowcharts, sequence, ER, state, mindmap, class, C4 (Mermaid) → `./assets/mermaid-flowchart.html`
- Data tables, comparisons, audits → `./assets/data-table.html`
- Slide decks → `./assets/slide-deck.html` + `./references/slide-patterns.md`
- CSS/layout patterns, SVG connectors, overflow rules → `./references/css-patterns.md`
- Pages with 4+ sections → also read `./references/responsive-nav.md`
- Font pairings, Mermaid CDN, Chart.js, anime.js → `./references/libraries.md`

**Rendering approach quick-reference:**

| Content type | Approach |
|---|---|
| Architecture (text-heavy) | CSS Grid cards + flow arrows |
| Architecture (topology-focused) | Mermaid `graph TD` |
| Flowchart / pipeline | Mermaid `graph TD` |
| Sequence diagram | Mermaid `sequenceDiagram` |
| Data flow | Mermaid with edge labels |
| ER / schema | Mermaid `erDiagram` |
| State machine | Mermaid `stateDiagram-v2` (simple labels only) |
| Mind map | Mermaid `mindmap` |
| Class diagram | Mermaid `classDiagram` |
| C4 architecture | Mermaid `graph TD` + `subgraph` (NOT native C4Context) |
| Data table | HTML `<table>` |
| Timeline | CSS central line + cards |
| Dashboard | CSS Grid + Chart.js |

**Mermaid rules (critical):**
- Always use `theme: 'base'` with custom `themeVariables` — read `./references/libraries.md` for full setup
- Always center with `display: flex; justify-content: center` on the wrap container
- Always add zoom controls (+/−/reset/expand) and click-to-expand — read `./references/css-patterns.md` "Mermaid Containers"
- **Never use bare `<pre class="mermaid">`** — always use the full `diagram-shell` pattern from `./assets/mermaid-flowchart.html`
- Max 10–12 nodes per diagram; use hybrid pattern (Mermaid overview + CSS cards) for 15+
- Use `flowchart TD` over `flowchart LR` for complex diagrams
- Use `<br/>` for line breaks in labels, never `\n`
- **Never define `.node` as a page-level CSS class** — use `.ve-card` instead

### 3. Style

**Typography** — pick a pairing from `./references/libraries.md`. Forbidden as `--font-body`: Inter, Roboto, Arial, system-ui alone.

**Good pairings:**
- DM Sans + Fira Code (technical)
- Instrument Serif + JetBrains Mono (editorial)
- IBM Plex Sans + IBM Plex Mono (reliable)
- Bricolage Grotesque + Fragment Mono (bold)
- Plus Jakarta Sans + Azeret Mono (approachable)

**Color** — use CSS custom properties. Define `--bg`, `--surface`, `--border`, `--text`, `--text-dim`, plus 3–5 semantic accents. Support both light and dark themes.

**Forbidden accents:** `#8b5cf6`, `#7c3aed`, `#a78bfa` (indigo/violet), `#d946ef` (fuchsia), cyan+magenta+pink combos.

**Good palettes:** terracotta+sage, teal+slate, rose+cranberry, amber+emerald, deep blue+gold.

**Forbidden animations:** glowing box-shadows, pulsing/breathing on static content, continuous animations after load.

### 4. Deliver

**Output location:** Write to `~/.agent/diagrams/`. Use a descriptive filename: `modem-architecture.html`, `pipeline-flow.html`.

**Open in browser:**
- macOS: `open ~/.agent/diagrams/filename.html`
- Linux: `xdg-open ~/.agent/diagrams/filename.html`

**Share via Vercel:**
```bash
bash <skill-dir>/scripts/share.sh ~/.agent/diagrams/filename.html
```

## File Structure

Every diagram is a single self-contained `.html` file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Descriptive Title</title>
  <link href="https://fonts.googleapis.com/css2?family=...&display=swap" rel="stylesheet">
  <style>/* All CSS inline — no external stylesheets */</style>
</head>
<body>
  <!-- Semantic HTML: sections, headings, tables, inline SVG -->
  <!-- Optional: <script> for Mermaid, Chart.js, anime.js -->
</body>
</html>
```

## Quality Checks

Before delivering:
- **Squint test** — blur your eyes. Can you still perceive hierarchy?
- **Swap test** — would replacing fonts/colors with generic dark theme make this indistinguishable from a template?
- **Both themes** — toggle OS light/dark. Both should look intentional.
- **No overflow** — resize to different widths. No content clips. Every grid/flex child needs `min-width: 0`.
- **Mermaid zoom** — every `.mermaid-wrap` must have zoom controls, Ctrl+scroll, drag-to-pan, and click-to-expand.
- **File opens cleanly** — no console errors, no layout shifts.

## Anti-Patterns (AI Slop — Never Do These)

- Inter/Roboto font + violet/indigo accents + gradient text on headings
- `background-clip: text` gradient on headings
- Emoji icons (`🏗️`, `⚙️`, etc.) in section headers
- Animated glowing box-shadows (`box-shadow: 0 0 20px...`)
- Cyan+magenta+pink neon color scheme on dark background
- Perfectly uniform card grid with no visual hierarchy
- Three-dot window chrome (red/yellow/green dots) on code blocks
- Bare `<pre class="mermaid">` without zoom controls
- `.node` as a CSS class name (collides with Mermaid internals)
