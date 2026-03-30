# Design: drawio-agile-diagrams Skill

**Date**: 2026-03-29
**Status**: Approved

## Overview

A skill that generates `.drawio` XML files for 5 agile diagram types. No CLI dependencies, no pip/npm installs. Output is a raw `.drawio` file the user opens in draw.io (web or desktop on Windows).

## Constraints

- Windows-based teams — no draw.io Desktop CLI for export
- Output is `.drawio` XML only — user imports into draw.io UI manually
- No external dependencies — pure Python string generation of XML
- Must chain with existing skills (epic-decomposer, feature-brief-generator, story-refiner)

## Skill Structure

```
.github/skills/drawio-agile-diagrams/
├── SKILL.md
└── LICENSE.txt
```

## SKILL.md Sections

### Section 1: mxGraph XML Primitives
- Valid `.drawio` file structure (mxGraphModel > root > mxCell)
- Node creation (vertex with mxGeometry, style strings)
- Edge creation (source/target IDs, must include mxGeometry relative="1")
- Container/group patterns (for swimlanes and sections)
- Style reference with color palette
- Grid-based layout patterns (auto-spacing formulas)

### Section 2: Five Diagram Types

| Diagram | Input | Output |
|---------|-------|--------|
| Dependency Map | Epic folder (story files with Dependencies field) | Nodes = stories colored by priority, edges = blocked-by |
| Story Hierarchy Tree | Epic overview story map table | Tree: Epic > grouped stories by number prefix |
| BPMN Process Flow | Text description or Given/When/Then acceptance criteria | Swimlane diagram with BPMN shapes |
| Sequence Diagram | Feature brief or text description | Lifeline boxes, message arrows, activation bars |
| C4 Context Diagram | Feature brief affected systems table | System boundary, services, actors, data flows |

### Section 3: Output Conventions
- Generator script: `generated/scripts/generate-<name>.py`
- Output file: `generated/output/<name>.drawio`
- Python standard library only (no pip)
- Instructions for opening in draw.io

### Section 4: Chaining
- After epic-decomposer: dependency map + hierarchy tree
- After feature-brief-generator: C4 context + sequence diagram
- After story-refiner: BPMN process flow

## Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| P1 / Critical | Red | #E06666 |
| P2 / High | Orange | #F6B26B |
| P3 / Medium | Blue | #6FA8DC |
| P4 / Low | Gray | #B4B4B4 |
| Containers | Light blue | #DAE8FC |
| External systems | Light green | #D5E8D4 |
| Actors / personas | Light yellow | #FFF2CC |
| Databases | Light purple | #E1D5E7 |
| Start/End events | Dark green/red | #6AA84F / #CC0000 |

## Implementation Plan

1. Create branch `feature/drawio-agile-diagrams`
2. Write `SKILL.md` with all 5 diagram types and XML format reference
3. Add `LICENSE.txt` (MIT)
4. Update `README.md` to mention the new skill
5. Commit and push
