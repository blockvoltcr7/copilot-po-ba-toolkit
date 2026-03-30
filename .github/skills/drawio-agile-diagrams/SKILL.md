---
name: drawio-agile-diagrams
description: >
  Generate draw.io diagram files (.drawio) for agile workflows — dependency maps,
  story hierarchy trees, BPMN process flows, sequence diagrams, and C4 context
  diagrams. Use this skill when a Product Owner, Business Analyst, or Tech Lead says
  "create a diagram", "draw a dependency map", "generate a flowchart", "visualize
  the epic", "create a process flow", "draw the architecture", "sequence diagram",
  "C4 diagram", or needs any visual diagram for PI planning, refinement, stakeholder
  communication, or design review. Output is a .drawio XML file that opens directly
  in draw.io (app.diagrams.net) or any draw.io-compatible editor — no CLI tools or
  platform-specific dependencies required.
license: MIT
---

# draw.io Agile Diagram Generator

Generate `.drawio` XML files for agile teams. No dependencies — output is a raw XML file the user opens in draw.io (web or desktop).

## How It Works

1. Read the input (epic folder, feature brief, text description, or acceptance criteria)
2. Write a Python script that generates mxGraph XML using only the standard library
3. Execute the script to produce a `.drawio` file
4. Save script to `generated/scripts/` and output to `generated/output/`

The user opens the `.drawio` file in:
- **draw.io web**: app.diagrams.net → File → Open From → Device
- **draw.io desktop** (Windows/Mac/Linux): double-click the file
- **VS Code**: with the draw.io extension
- **Confluence**: import via the draw.io plugin

## mxGraph XML Format Reference

Every `.drawio` file is XML using this structure:

```xml
<mxfile host="app.diagrams.net" agent="AI Generated">
  <diagram name="Page-1" id="page1">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1"
                  connect="1" arrows="1" fold="1" page="1" pageScale="1"
                  pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- All diagram cells go here with parent="1" -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### Creating Nodes (Vertices)

```xml
<mxCell id="node1" value="My Label" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;fontFamily=Arial;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="160" height="60" as="geometry" />
</mxCell>
```

**Rules:**
- Every node MUST have `vertex="1"` and `parent="1"`
- Every node MUST have an `<mxGeometry>` child with x, y, width, height
- Use `as="geometry"` on the mxGeometry element
- IDs must be unique strings across the entire diagram
- Use `html=1` in the style to enable HTML labels (allows `<br>` line breaks)
- Use `whiteSpace=wrap` to enable text wrapping inside nodes

### Creating Edges (Arrows)

```xml
<mxCell id="edge1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" source="node1" target="node2" parent="1">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

**Rules:**
- Every edge MUST have `edge="1"` and `parent="1"`
- Every edge MUST have `source` and `target` attributes referencing valid node IDs
- Every edge MUST have `<mxGeometry relative="1" as="geometry" />` as a child — NOT self-closing without this content. This is the most common error — missing this causes edges to not render.
- Use `edgeStyle=orthogonalEdgeStyle` for right-angle connectors (professional look)
- Use `edgeStyle=entityRelationEdgeStyle` for ERD-style connections
- Add `value="label text"` to put text on an edge

### Creating Containers (Groups / Swimlanes)

```xml
<!-- Container -->
<mxCell id="container1" value="Group Name" style="swimlane;startSize=30;fillColor=#DAE8FC;strokeColor=#6C8EBF;rounded=1;fontSize=14;fontStyle=1;fontFamily=Arial;" vertex="1" parent="1">
  <mxGeometry x="50" y="50" width="400" height="300" as="geometry" />
</mxCell>

<!-- Child node inside container — parent is the container ID -->
<mxCell id="child1" value="Task" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="container1">
  <mxGeometry x="20" y="40" width="120" height="40" as="geometry" />
</mxCell>
```

**Rules:**
- Container uses `style="swimlane;..."`
- `startSize=30` controls the header height
- Children reference the container ID in their `parent` attribute (NOT "1")
- Child geometry x/y is relative to the container's top-left corner

### Creating Horizontal Swimlanes (BPMN)

```xml
<!-- Swimlane pool (outer container) -->
<mxCell id="pool1" value="Process Name" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=14;fontFamily=Arial;" vertex="1" parent="1">
  <mxGeometry x="30" y="30" width="900" height="400" as="geometry" />
</mxCell>

<!-- Individual lane -->
<mxCell id="lane1" value="Actor Name" style="swimlane;startSize=30;horizontal=0;fillColor=#F5F5F5;strokeColor=#666666;fontSize=12;fontFamily=Arial;" vertex="1" parent="pool1">
  <mxGeometry x="0" y="30" width="900" height="120" as="geometry" />
</mxCell>
```

## Style Reference

### Color Palette

Use these colors consistently across all diagrams:

```python
COLORS = {
    # Priority colors (for story/task nodes)
    "p1": {"fill": "#E06666", "stroke": "#B85450", "font": "#FFFFFF"},  # Red — Critical
    "p2": {"fill": "#F6B26B", "stroke": "#D6A461", "font": "#000000"},  # Orange — High
    "p3": {"fill": "#6FA8DC", "stroke": "#5B8DB8", "font": "#000000"},  # Blue — Medium
    "p4": {"fill": "#B4B4B4", "stroke": "#999999", "font": "#000000"},  # Gray — Low

    # Semantic colors (for diagram elements)
    "container":  {"fill": "#DAE8FC", "stroke": "#6C8EBF"},  # Light blue — groups/containers
    "external":   {"fill": "#D5E8D4", "stroke": "#82B366"},  # Light green — external systems
    "actor":      {"fill": "#FFF2CC", "stroke": "#D6B656"},  # Light yellow — people/roles
    "database":   {"fill": "#E1D5E7", "stroke": "#9673A6"},  # Light purple — data stores
    "start":      {"fill": "#6AA84F", "stroke": "#4E8538"},  # Green — start events
    "end":        {"fill": "#CC0000", "stroke": "#990000"},  # Red — end events
    "decision":   {"fill": "#FFE599", "stroke": "#D6B656"},  # Yellow — gateways/decisions
    "default":    {"fill": "#FFFFFF", "stroke": "#666666"},  # White — generic nodes
}
```

### Common Styles

```python
STYLES = {
    # Nodes
    "rounded_box": "rounded=1;whiteSpace=wrap;html=1;fontSize=11;fontFamily=Arial;",
    "rectangle":   "whiteSpace=wrap;html=1;fontSize=11;fontFamily=Arial;",
    "diamond":     "rhombus;whiteSpace=wrap;html=1;fontSize=10;fontFamily=Arial;",
    "circle":      "ellipse;whiteSpace=wrap;html=1;fontSize=10;fontFamily=Arial;aspect=fixed;",
    "person":      "shape=mxgraph.basic.person;whiteSpace=wrap;html=1;fontSize=11;fontFamily=Arial;",
    "database":    "shape=mxgraph.flowchart.database;whiteSpace=wrap;html=1;fontSize=11;fontFamily=Arial;",
    "document":    "shape=mxgraph.basic.document;whiteSpace=wrap;html=1;fontSize=11;fontFamily=Arial;",

    # Edges
    "arrow":       "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;fontSize=10;fontFamily=Arial;",
    "dashed":      "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;dashed=1;fontSize=10;fontFamily=Arial;",
    "dotted":      "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;dashed=1;dashPattern=1 4;fontSize=10;fontFamily=Arial;",

    # Containers
    "swimlane":    "swimlane;startSize=30;fontSize=13;fontStyle=1;fontFamily=Arial;",
    "group":       "rounded=1;whiteSpace=wrap;html=1;dashed=1;dashPattern=8 4;fontSize=13;fontStyle=1;fontFamily=Arial;",
}
```

### Layout Constants

```python
LAYOUT = {
    "node_width": 160,
    "node_height": 60,
    "node_spacing_x": 60,     # horizontal gap between nodes
    "node_spacing_y": 80,     # vertical gap between nodes
    "container_padding": 30,  # padding inside containers
    "swimlane_height": 120,   # height per swimlane row
    "page_margin": 40,        # margin from page edges
}
```

## Diagram Type 1: Dependency Map

**Input**: Epic folder from the epic-decomposer skill (reads story `.md` files)

**What it generates**: A directed graph where nodes are stories and edges show "blocked by" relationships. Stories are colored by priority and grouped by number prefix (1.x, 2.x, 3.x).

### Workflow

1. Read all `.md` files in the epic folder (skip `epic-overview.md`)
2. Parse each file for: story number, title, priority, size, type, dependencies (Blocked by / Blocks)
3. Create a node for each story
4. Create edges for each dependency relationship
5. Group nodes by number prefix into containers (1.x = group 1, 2.x = group 2)
6. Layout: groups arranged left-to-right, stories stacked vertically within each group

### Node Format

Each story node displays:
```
[Number] Story Title
[Type] | [Size] pts
```

Example: A P1 story node with size 3:
```xml
<mxCell id="story_1_1" value="1.1 Risk Calculation Service&lt;br&gt;&lt;i&gt;Story | 3 pts&lt;/i&gt;"
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E06666;strokeColor=#B85450;fontColor=#FFFFFF;fontSize=11;fontFamily=Arial;"
  vertex="1" parent="group_1">
  <mxGeometry x="20" y="80" width="180" height="60" as="geometry" />
</mxCell>
```

### Edge Format

Dependency edges use solid arrows. The direction is: source (blocked story) ← target (blocking story).
```xml
<mxCell id="dep_1" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;endArrow=block;endFill=1;"
  edge="1" source="story_1_0" target="story_1_1" parent="1">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

### Parsing Dependencies

From each story file, look for:
```markdown
## Dependencies
- **Blocked by**: 1.0, 1.2
- **Blocks**: 2.0, 2.1
```

Parse the numbers and create edges accordingly.

### Legend

Add a legend box in the bottom-right corner showing the priority color coding:
```
Priority Legend:
■ P1 Critical  ■ P2 High  ■ P3 Medium  ■ P4 Low
```

### Example Prompt

```
Generate a dependency map from the epic folder at
epics/2026-03-28-client-portfolio-risk-alerts/.
Save to generated/output/risk-alerts-dependency-map.drawio
```

---

## Diagram Type 2: Story Hierarchy Tree

**Input**: Epic overview file (`epic-overview.md`) from the epic-decomposer skill

**What it generates**: A top-down tree diagram with the epic at the root and stories as children, grouped by number prefix.

### Workflow

1. Read the `epic-overview.md` file
2. Parse the Story Map table for: number, story name, type, size, priority
3. Create the root node (epic title)
4. Create group nodes for each number prefix (1.x, 2.x, 3.x)
5. Create leaf nodes for each story
6. Connect with edges: epic → groups → stories
7. Layout: top-down tree with automatic spacing

### Layout

```
                    ┌──────────────┐
                    │  Epic Title  │
                    └──────┬───────┘
              ┌────────────┼────────────┐
         ┌────┴────┐  ┌────┴────┐  ┌────┴────┐
         │ Group 1 │  │ Group 2 │  │ Group 3 │
         └────┬────┘  └────┬────┘  └────┬────┘
          ┌───┼───┐    ┌───┼───┐    ┌───┼───┐
          │   │   │    │   │   │    │   │   │
         1.0 1.1 1.2  2.0 2.1     3.0 3.1
```

### Node Styles

- **Epic node**: Large, dark blue container header style
- **Group nodes**: Medium, light blue container style
- **Story nodes**: Standard sized, colored by priority
- **Spike nodes**: Dashed border to distinguish research tasks

### Example Prompt

```
Generate a story hierarchy tree from the epic at
epics/2026-03-28-client-portfolio-risk-alerts/epic-overview.md.
Save to generated/output/risk-alerts-hierarchy.drawio
```

---

## Diagram Type 3: BPMN Process Flow

**Input**: Text description of a business process, or Given/When/Then acceptance criteria from story files

**What it generates**: A swimlane-based BPMN diagram with standard BPMN shapes (start/end events, tasks, gateways, flows).

### BPMN Shapes

| Shape | Style | Usage |
|-------|-------|-------|
| Start Event | Green circle (`ellipse;fillColor=#6AA84F;aspect=fixed;`) with width/height=30 | Beginning of process |
| End Event | Red circle with thick border (`ellipse;fillColor=#CC0000;strokeWidth=3;aspect=fixed;`) with width/height=30 | End of process |
| Task | Rounded rectangle (`rounded=1;whiteSpace=wrap;html=1;`) | An activity/action |
| Gateway (XOR) | Diamond (`rhombus;fillColor=#FFE599;`) with width/height=40 | Decision point (exclusive) |
| Gateway (AND) | Diamond with + marker (`rhombus;fillColor=#FFE599;html=1;` with value="+") | Parallel split/join |
| Data Object | Document shape | Input/output data |

### Swimlane Layout

Each actor/role gets a horizontal swimlane:

```
┌─────────────────────────────────────────────────────────┐
│ Process: Client Portfolio Risk Alert                     │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ System   │  (●)──→[Calculate Risk]──→◇──→[Generate      │
│          │                           │    Alert]──→(◉)  │
│          │                           │                  │
├──────────┼───────────────────────────┼──────────────────┤
│          │                           │                  │
│ Advisor  │                           └──→[Review &      │
│          │                                Acknowledge]  │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Converting Given/When/Then to BPMN

When reading acceptance criteria:
- **Given** → Start event + initial state/precondition (annotated)
- **When** → Task or gateway (if condition)
- **Then** → Task + End event (expected outcome)
- Multiple ACs → Multiple paths through the process

### Example Prompt

```
Generate a BPMN process flow for the risk alert workflow:
1. System calculates portfolio risk scores daily
2. If risk score exceeds client tolerance, generate an alert
3. Alert is sent to advisor via dashboard and email
4. Advisor reviews the alert and takes action (acknowledge, dismiss, or escalate)
5. If escalated, compliance team reviews
6. All actions are logged to audit trail

Actors: System, Advisor, Compliance Team
Save to generated/output/risk-alert-process-flow.drawio
```

---

## Diagram Type 4: Sequence Diagram

**Input**: Feature brief (affected systems section) or text description of system interactions

**What it generates**: A UML-style sequence diagram with lifeline boxes, message arrows, and activation bars.

### Layout Structure

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │    │  API GW  │    │ Portfolio │    │  Notif   │
│          │    │          │    │ Service   │    │ Service  │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │
     │──── Request ──→│               │               │
     │               │── Get Risk ──→│               │
     │               │               │── Calculate ──→│
     │               │               │←── Score ─────│
     │               │←── Response ──│               │
     │←── Result ────│               │               │
     │               │               │               │
```

### Element Construction

**Lifeline header** (box at top):
```xml
<mxCell id="ll_1" value="Portfolio Service"
  style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;fontStyle=1;fontFamily=Arial;"
  vertex="1" parent="1">
  <mxGeometry x="100" y="40" width="140" height="50" as="geometry" />
</mxCell>
```

**Lifeline (vertical dashed line)**:
```xml
<mxCell id="ll_1_line" value=""
  style="endArrow=none;dashed=1;dashPattern=4 4;strokeColor=#999999;"
  edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="170" y="90" as="sourcePoint" />
    <mxPoint x="170" y="500" as="targetPoint" />
  </mxGeometry>
</mxCell>
```

**Message arrow** (horizontal with label):
```xml
<mxCell id="msg_1" value="calculateRisk()"
  style="edgeStyle=none;rounded=0;endArrow=block;endFill=1;fontSize=10;fontFamily=Arial;"
  edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="170" y="130" as="sourcePoint" />
    <mxPoint x="380" y="130" as="targetPoint" />
  </mxGeometry>
</mxCell>
```

**Return arrow** (dashed, going back):
```xml
<mxCell id="ret_1" value="riskScore"
  style="edgeStyle=none;rounded=0;endArrow=open;endFill=0;dashed=1;fontSize=10;fontFamily=Arial;"
  edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="380" y="160" as="sourcePoint" />
    <mxPoint x="170" y="160" as="targetPoint" />
  </mxGeometry>
</mxCell>
```

### Spacing Rules

- Lifeline headers: 200px apart horizontally
- Messages: 40px apart vertically
- Activation bars: 10px wide rectangles on the lifeline
- Start lifelines at y=40, messages at y=120+

### Example Prompt

```
Generate a sequence diagram showing how the risk alert system works:
1. Scheduler triggers the Risk Engine daily
2. Risk Engine calls Portfolio Service to get all portfolios
3. For each portfolio, Risk Engine calls Risk Calculator
4. Risk Calculator returns a risk score
5. If score exceeds threshold, Risk Engine calls Notification Service
6. Notification Service sends alert to Advisor Dashboard
7. Notification Service sends email to Advisor

Save to generated/output/risk-alert-sequence.drawio
```

---

## Diagram Type 5: C4 Context Diagram

**Input**: Feature brief (affected systems table and architecture section) or text description

**What it generates**: A C4 Level 1 (System Context) diagram showing the system boundary, internal services, external systems, and actors.

### C4 Shapes

| Element | Shape | Style |
|---------|-------|-------|
| Person | Rounded rectangle with person icon | `fillColor=#FFF2CC;strokeColor=#D6B656;` |
| Internal System | Rounded rectangle | `fillColor=#DAE8FC;strokeColor=#6C8EBF;` |
| External System | Rounded rectangle (dashed border) | `fillColor=#D5E8D4;strokeColor=#82B366;dashed=1;` |
| Database | Cylinder shape | `fillColor=#E1D5E7;strokeColor=#9673A6;shape=mxgraph.flowchart.database;` |
| System Boundary | Large dashed container | `dashed=1;dashPattern=8 4;fillColor=#F5F5F5;` |

### Layout Pattern

```
        ┌──────────┐                    ┌──────────────┐
        │ Financial │                    │  Compliance   │
        │ Advisor   │                    │  Officer      │
        │ [Person]  │                    │  [Person]     │
        └─────┬─────┘                    └──────┬────────┘
              │                                 │
              ▼                                 ▼
    ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
    │  Wealth Management Platform                       │
    │                                                   │
    │  ┌─────────────┐   ┌─────────────┐   ┌────────┐  │
    │  │  Portfolio   │──→│    Risk     │──→│ Notif  │  │
    │  │  Service     │   │   Engine    │   │Service │  │
    │  └─────────────┘   └─────────────┘   └────────┘  │
    │                                                   │
    └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
              │                                 │
              ▼                                 ▼
    ┌──────────────────┐              ┌──────────────────┐
    │  Market Data API │              │   Email Service   │
    │   [External]     │              │    [External]     │
    └──────────────────┘              └──────────────────┘
```

### Node Labels for C4

C4 nodes should include a description line below the name:
```xml
<mxCell id="sys1" value="&lt;b&gt;Portfolio Service&lt;/b&gt;&lt;br&gt;&lt;i&gt;Manages client portfolios&lt;br&gt;and holdings&lt;/i&gt;"
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=11;fontFamily=Arial;"
  vertex="1" parent="boundary1">
  <mxGeometry x="30" y="60" width="180" height="70" as="geometry" />
</mxCell>
```

### Parsing Feature Briefs

From the feature brief, extract:
- **Affected Systems table** → Internal system nodes
- **Target Users / Personas** → Person nodes (actors)
- **External Dependencies** → External system nodes
- **Architecture section** → Data flow edges between systems

### Example Prompt

```
Generate a C4 context diagram from the feature brief at
docs/feature-briefs/2026-03-28-client-portfolio-risk-alerts.md.
Show the system boundary, internal services, external systems,
and actor interactions.
Save to generated/output/risk-alerts-c4-context.drawio
```

---

## Critical Rules

1. **Always generate a Python script** — never try to write XML inline in the chat. Write a Python script that generates the XML using string formatting / f-strings. Save the script to `generated/scripts/`.

2. **Always include mxGeometry on edges** — every edge MUST have `<mxGeometry relative="1" as="geometry" />` as a child element. Missing this is the #1 cause of broken diagrams.

3. **Always use unique IDs** — every mxCell must have a unique `id`. Use descriptive prefixes: `node_`, `edge_`, `group_`, `lane_`, `msg_`, `ll_` (lifeline).

4. **Always set parent correctly** — nodes inside containers must reference the container's ID as their `parent`, not "1". Top-level elements use `parent="1"`.

5. **Always use html=1 in styles** — this enables `<br>` for line breaks and `<b>`/`<i>` for formatting in labels. Escape angle brackets in XML values: `&lt;b&gt;` not `<b>`.

6. **Use the color palette consistently** — priority colors for story nodes, semantic colors for diagram elements. Never use random colors.

7. **Grid-based positioning** — use multiples of 10 for x/y coordinates. This aligns with draw.io's default grid and makes the diagram clean when opened.

8. **No external dependencies** — the Python script must use only the standard library. No `pip install` required. Use f-strings or string concatenation to build XML.

9. **Escape XML special characters** — in `value` attributes, use `&amp;` for &, `&lt;` for <, `&gt;` for >, `&quot;` for ". In HTML labels inside values, escape the HTML tags: `&lt;b&gt;Bold&lt;/b&gt;`.

10. **Test the output** — after generating, tell the user to open the `.drawio` file in draw.io to verify. If anything looks wrong, they can adjust layout manually in the draw.io editor.

## Output Conventions

- **Generator scripts**: `generated/scripts/generate-<diagram-name>.py`
- **Output files**: `generated/output/<diagram-name>.drawio`
- **File naming**: use kebab-case, descriptive names (e.g., `risk-alerts-dependency-map.drawio`)

## After Generation

Tell the user:

> "Diagram saved to `generated/output/<name>.drawio`.
>
> To view: Open in [draw.io](https://app.diagrams.net) → File → Open From → Device → select the file.
>
> You can adjust layout, colors, and labels directly in the draw.io editor."

## Chaining With Other Skills

| After This Skill | Generate This Diagram |
|-----------------|----------------------|
| **epic-decomposer** | Dependency map + Story hierarchy tree |
| **feature-brief-generator** | C4 context diagram + Sequence diagram |
| **story-refiner** | BPMN process flow (from refined acceptance criteria) |
| **pi-planning-workbook** | Dependency map across all features in the PI |

When another skill finishes, suggest the relevant diagram:

> "Epic folder created. Want me to generate a dependency map showing story relationships?"

> "Feature brief saved. Want me to generate a C4 context diagram showing the system architecture?"
