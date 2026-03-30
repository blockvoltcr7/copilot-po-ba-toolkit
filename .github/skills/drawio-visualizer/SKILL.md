---
name: drawio-visualizer
description: >
  This skill should be used when the user asks to "visualize this", "draw a diagram",
  "diagram what we've been discussing", "generate a draw.io diagram", "I need to see this",
  "create an architecture diagram", "show me how these services connect", "draw the flow",
  "visualize the architecture", "create a diagram of this codebase", or needs to crystallize
  complex codebase understanding into a shareable .drawio diagram file. Triggers mid-session
  after the user has been exploring code, debugging flows, or designing solutions and wants
  a visual artifact they can share with their team or upload to Confluence.
license: MIT
---

# draw.io Visualizer

Crystallize codebase understanding from the current session into professional `.drawio` diagram files. The conversation IS the input — no structured files or templates required.

## When This Skill Applies

This skill targets a specific workflow: the user has been exploring a codebase for 10-20 minutes — reading files, tracing call chains, asking questions, debugging flows. The session is loaded with rich context (100K+ tokens of understanding). Now the user needs to **see** that understanding as a diagram they can share with their team or upload to Confluence.

The skill does NOT scan the codebase from scratch. The agent already has the context from the conversation. The skill teaches how to render that understanding as a `.drawio` file.

## How It Works

1. Assess what the user has been exploring in the current session
2. Choose the best diagram type for the situation (see Diagram Type Selection)
3. Write a Python script that generates mxGraph XML using only the standard library
4. Execute the script to produce a `.drawio` file
5. Save script to `generated/scripts/` and output to `generated/output/`

## Diagram Type Selection

Based on what was discussed in the session, select the most appropriate layout:

| Session Context | Diagram Type | Layout |
|----------------|-------------|--------|
| Tracing a request across services | **Sequence Diagram** | Lifelines left-to-right, messages top-to-bottom |
| Understanding how modules/services connect | **Architecture Diagram** | Layered top-to-bottom (UI → API → Services → Data) |
| Debugging a call chain or execution path | **Flowchart** | Left-to-right or top-to-bottom with decision diamonds |
| Mapping data transformations between systems | **Data Flow Diagram** | Left-to-right with process nodes and data stores |
| Understanding state transitions | **State Machine Diagram** | States as rounded boxes, transitions as labeled arrows |
| Exploring class/module relationships | **Component Diagram** | Grouped boxes with dependency arrows |
| Designing a new solution | **Solution Architecture** | Layered with system boundary, grouped by concern |

When unclear, default to **Architecture Diagram** — it is the most versatile and readable.

## Generating the Diagram

### Step 1: Identify Elements from the Session

Extract from the conversation context:
- **Services/modules** discussed → become nodes
- **Function calls or API calls** between them → become edges
- **Databases, queues, caches** mentioned → become data store shapes
- **External systems or APIs** → become external nodes (different color)
- **Users or actors** → become person shapes
- **Logical groupings** (layers, domains, bounded contexts) → become containers

### Step 2: Write a Python Script

Generate a Python script using only the standard library (no pip install). The script builds mxGraph XML via f-strings and writes a `.drawio` file.

Consult `references/mxgraph-xml-reference.md` for the complete XML format specification, shape styles, color palette, and layout constants.

### Step 3: Apply Professional Styling

**Layer-based coloring** — assign colors based on architectural layer:
- Frontend/UI: light blue (`#DAE8FC`)
- API/Gateway: light green (`#D5E8D4`)
- Services/Business logic: light yellow (`#FFF2CC`)
- Data/Storage: light purple (`#E1D5E7`)
- External systems: light red (`#F8CECC`)
- Infrastructure: light gray (`#F5F5F5`)

**Use real names from the code** — label nodes with actual class names, service names, function names, and file paths from the session. Never use generic labels like "Service A" or "Module 1".

**Keep it readable** — if more than 15 nodes exist, group related nodes into containers. If more than 20 edges exist, consider a multi-page diagram with overview and detail views.

### Step 4: Handle Complexity

For complex systems with many components:
- **Use containers** to group by domain/module/layer — reduces visual noise
- **Use multi-page diagrams** — page 1 for high-level overview, page 2+ for detailed views
- **Highlight the area of focus** — if the user was debugging a specific flow, highlight those nodes with a bolder border or attention color
- **Add a title and legend** — include a diagram title describing what was explored and a color legend if multiple layers are shown

## Output Conventions

- **Generator scripts**: `generated/scripts/generate-<diagram-name>.py`
- **Output files**: `generated/output/<diagram-name>.drawio`
- **File naming**: use kebab-case, descriptive names derived from what was explored (e.g., `payment-refund-flow.drawio`, `order-service-architecture.drawio`)
- **No external dependencies**: Python standard library only — no pip install

## After Generation

Tell the user:

> "Diagram saved to `generated/output/<name>.drawio`.
>
> To view: Open in [draw.io](https://app.diagrams.net) → File → Open From → Device → select the file.
>
> The diagram is fully editable — adjust layout, colors, and labels in the draw.io editor. Compatible with the Confluence draw.io plugin for team sharing."

## Critical Rules

1. **The conversation is the input** — do not ask the user to provide structured data or files. The understanding already exists in the session context from prior exploration.

2. **Use real names from the codebase** — label every node with the actual service name, class name, file path, or function name discussed in the session. Never use placeholder labels.

3. **Always generate a Python script** — never write XML inline in the chat. Write a Python script that generates the XML. Save to `generated/scripts/`.

4. **Always include mxGeometry on edges** — every edge MUST have `<mxGeometry relative="1" as="geometry" />`. Missing this breaks the diagram. See `references/mxgraph-xml-reference.md`.

5. **Grid-aligned coordinates** — use multiples of 10 for all x, y, width, height values.

6. **Escape XML characters** — in value attributes use `&amp;`, `&lt;`, `&gt;`, `&quot;`. For HTML formatting in labels use `&lt;b&gt;`, `&lt;br&gt;`, `&lt;i&gt;`.

7. **No external dependencies** — Python standard library only. The team runs this on Windows — no CLI tools, no pip packages.

8. **Confluence-ready quality** — these diagrams get uploaded to Confluence. Professional colors, clean spacing, readable fonts, meaningful titles.

## Additional Resources

### Reference Files

For the complete mxGraph XML format specification, shape library, color palette, edge styles, and layout patterns:
- **`references/mxgraph-xml-reference.md`** — Full XML format reference with code examples for every element type
