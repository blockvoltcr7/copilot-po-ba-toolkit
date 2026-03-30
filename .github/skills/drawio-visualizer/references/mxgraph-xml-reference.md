# mxGraph XML Format Reference

Complete reference for generating valid `.drawio` files programmatically.

## File Structure

Every `.drawio` file uses this XML structure:

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

The two mandatory cells (`id="0"` and `id="1"`) must always be present. All diagram elements reference `parent="1"` unless inside a container.

## Nodes (Vertices)

```xml
<mxCell id="node1" value="My Label" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;fontFamily=Arial;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="160" height="60" as="geometry" />
</mxCell>
```

Rules:
- Every node MUST have `vertex="1"` and `parent="1"` (or a container ID)
- Every node MUST have an `<mxGeometry>` child with x, y, width, height and `as="geometry"`
- IDs must be unique strings across the entire diagram
- Use `html=1` in style to enable HTML labels (`<br>`, `<b>`, `<i>`)
- Use `whiteSpace=wrap` to enable text wrapping

## Edges (Arrows)

```xml
<mxCell id="edge1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;" edge="1" source="node1" target="node2" parent="1">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

**CRITICAL:** Every edge MUST have `<mxGeometry relative="1" as="geometry" />` as a child element. Missing this causes edges to not render. This is the #1 cause of broken diagrams.

Rules:
- Every edge MUST have `edge="1"` and `parent="1"`
- Every edge MUST have `source` and `target` referencing valid node IDs
- Use `edgeStyle=orthogonalEdgeStyle` for right-angle connectors (professional look)
- Add `value="label"` for edge labels

### Edge with manual source/target points (no source/target nodes)

```xml
<mxCell id="edge2" value="label" style="edgeStyle=none;rounded=0;endArrow=block;endFill=1;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="170" y="130" as="sourcePoint" />
    <mxPoint x="380" y="130" as="targetPoint" />
  </mxGeometry>
</mxCell>
```

### Return/response arrows (dashed)

```xml
<mxCell id="ret1" value="response" style="edgeStyle=none;rounded=0;endArrow=open;endFill=0;dashed=1;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="380" y="160" as="sourcePoint" />
    <mxPoint x="170" y="160" as="targetPoint" />
  </mxGeometry>
</mxCell>
```

## Containers and Groups

```xml
<!-- Container -->
<mxCell id="container1" value="Group Name" style="swimlane;startSize=30;fillColor=#DAE8FC;strokeColor=#6C8EBF;rounded=1;fontSize=14;fontStyle=1;fontFamily=Arial;" vertex="1" parent="1">
  <mxGeometry x="50" y="50" width="400" height="300" as="geometry" />
</mxCell>

<!-- Child inside container — parent is the container ID, NOT "1" -->
<mxCell id="child1" value="Task" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="container1">
  <mxGeometry x="20" y="40" width="120" height="40" as="geometry" />
</mxCell>
```

Rules:
- Container uses `style="swimlane;..."` with `startSize=30` for header height
- Children set their `parent` to the container's ID
- Child x/y coordinates are relative to the container's top-left

## Horizontal Swimlanes

```xml
<!-- Outer pool -->
<mxCell id="pool1" value="Process" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;" vertex="1" parent="1">
  <mxGeometry x="30" y="30" width="900" height="400" as="geometry" />
</mxCell>

<!-- Lane -->
<mxCell id="lane1" value="Actor" style="swimlane;startSize=30;horizontal=0;fillColor=#F5F5F5;" vertex="1" parent="pool1">
  <mxGeometry x="0" y="30" width="900" height="120" as="geometry" />
</mxCell>
```

## Common Shape Styles

### Node Shapes

| Shape | Style |
|-------|-------|
| Rounded box | `rounded=1;whiteSpace=wrap;html=1;` |
| Rectangle | `whiteSpace=wrap;html=1;` |
| Diamond | `rhombus;whiteSpace=wrap;html=1;` |
| Circle | `ellipse;whiteSpace=wrap;html=1;aspect=fixed;` |
| Person | `shape=mxgraph.basic.person;whiteSpace=wrap;html=1;` |
| Database/Cylinder | `shape=mxgraph.flowchart.database;whiteSpace=wrap;html=1;` |
| Document | `shape=mxgraph.basic.document;whiteSpace=wrap;html=1;` |
| Hexagon | `shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;` |
| Cloud | `ellipse;shape=cloud;whiteSpace=wrap;html=1;` |
| Parallelogram | `shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;` |

### Edge Styles

| Style | Usage |
|-------|-------|
| `edgeStyle=orthogonalEdgeStyle;rounded=1;` | Right-angle connectors (default) |
| `edgeStyle=none;` | Straight line |
| `dashed=1;` | Dashed line |
| `dashed=1;dashPattern=1 4;` | Dotted line |
| `endArrow=block;endFill=1;` | Solid arrowhead |
| `endArrow=open;endFill=0;` | Open arrowhead |
| `endArrow=none;` | No arrowhead |
| `startArrow=block;startFill=1;` | Arrow on start side |

### Decorations

| Effect | Style |
|--------|-------|
| Bold text | `fontStyle=1;` |
| Italic | `fontStyle=2;` |
| Bold+Italic | `fontStyle=3;` |
| Font size | `fontSize=12;` |
| Font color | `fontColor=#333333;` |
| Dashed border | `dashed=1;dashPattern=8 4;` |
| Thick border | `strokeWidth=2;` |
| No border | `strokeColor=none;` |
| Shadow | `shadow=1;` |
| Rounded corners | `rounded=1;arcSize=20;` |

## Color Palette

Professional, consistent colors for different diagram elements:

```python
COLORS = {
    # Layer colors
    "frontend":    {"fill": "#DAE8FC", "stroke": "#6C8EBF"},  # Light blue
    "api":         {"fill": "#D5E8D4", "stroke": "#82B366"},  # Light green
    "service":     {"fill": "#FFF2CC", "stroke": "#D6B656"},  # Light yellow
    "data":        {"fill": "#E1D5E7", "stroke": "#9673A6"},  # Light purple
    "external":    {"fill": "#F8CECC", "stroke": "#B85450"},  # Light red
    "infra":       {"fill": "#F5F5F5", "stroke": "#666666"},  # Light gray

    # Semantic colors
    "highlight":   {"fill": "#FF6666", "stroke": "#CC0000"},  # Red — attention
    "success":     {"fill": "#6AA84F", "stroke": "#4E8538"},  # Green — success/start
    "warning":     {"fill": "#F6B26B", "stroke": "#D6A461"},  # Orange — warning
    "info":        {"fill": "#6FA8DC", "stroke": "#5B8DB8"},  # Blue — info
    "neutral":     {"fill": "#FFFFFF", "stroke": "#666666"},  # White — default

    # Boundary/container
    "boundary":    {"fill": "#F5F5F5", "stroke": "#999999"},  # System boundary
}
```

## Layout Constants

```python
LAYOUT = {
    "node_width": 160,
    "node_height": 60,
    "node_spacing_x": 60,
    "node_spacing_y": 80,
    "container_padding": 30,
    "swimlane_height": 120,
    "page_margin": 40,
    "lifeline_spacing": 200,   # for sequence diagrams
    "message_spacing": 40,     # for sequence diagrams
}
```

## XML Escaping

In `value` attributes, escape special characters:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`

For HTML labels inside values:
```xml
value="&lt;b&gt;Service Name&lt;/b&gt;&lt;br&gt;&lt;i&gt;Description&lt;/i&gt;"
```

## Multi-Page Diagrams

Add multiple `<diagram>` elements inside `<mxfile>`:

```xml
<mxfile>
  <diagram name="Overview" id="page1">
    <mxGraphModel>...</mxGraphModel>
  </diagram>
  <diagram name="Detail View" id="page2">
    <mxGraphModel>...</mxGraphModel>
  </diagram>
</mxfile>
```

## Grid Alignment

Use multiples of 10 for all x, y, width, height values. This aligns with draw.io's default grid and produces clean diagrams when opened in the editor.

## Common Patterns

### Layered Architecture (top-down)

Arrange containers vertically:
- y=40: Frontend/UI layer
- y=200: API/Gateway layer
- y=360: Service/Business logic layer
- y=520: Data/Storage layer
- y=680: Infrastructure layer

### Left-to-Right Flow

Arrange nodes horizontally with x increments of 220 (160 width + 60 spacing).

### Hub and Spoke

Central node at (400, 300), satellite nodes arranged in a circle around it.

### Sequence (vertical timeline)

Lifeline headers at y=40, messages at y=120 with 40px increments downward.
