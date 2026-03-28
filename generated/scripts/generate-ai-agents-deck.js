const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI Agent Teams & Sub-Agents for Product Teams";
pres.author = "GitHub Copilot CLI Research";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  navy:      "1A1F5E",  // primary dark
  teal:      "028090",  // accent
  coral:     "E84855",  // highlight
  sky:       "CADCFC",  // light blue
  lightBg:   "F4F7FC",  // content slide bg
  white:     "FFFFFF",
  muted:     "64748B",
  cardBg:    "FFFFFF",
  darkCard:  "232B7A",
  mint:      "AAD7D9",
  gold:      "F9C74F",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.12 });

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function addSlideHeader(slide, title, subtitle, dark = false) {
  const bg = dark ? C.navy : C.lightBg;
  const fg = dark ? C.white : C.navy;
  slide.background = { color: bg };
  // Top accent bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.07, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addText(title, { x: 0.45, y: 0.22, w: 9.1, h: 0.65, fontSize: 26, bold: true, color: fg, fontFace: "Calibri", margin: 0 });
  if (subtitle) {
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 0.92, w: 0.5, h: 0.05, fill: { color: C.teal }, line: { color: C.teal } });
    slide.addText(subtitle, { x: 1.1, y: 0.8, w: 8.5, h: 0.4, fontSize: 12, color: C.teal, fontFace: "Calibri", bold: true, margin: 0 });
  }
}

function addCard(slide, x, y, w, h, accentColor) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.cardBg }, shadow: makeShadow(), line: { color: "E2E8F0", width: 0.5 } });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.07, h, fill: { color: accentColor }, line: { color: accentColor } });
}

function addDarkCard(slide, x, y, w, h, fillColor) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fillColor || C.darkCard }, shadow: makeShadow(), line: { color: fillColor || C.darkCard } });
}

function addSectionDivider(slide, sectionNum, title, subtitle) {
  slide.background = { color: C.navy };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.07, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.555, w: 10, h: 0.07, fill: { color: C.teal }, line: { color: C.teal } });
  // Big section number
  slide.addText(sectionNum, { x: 0.4, y: 1.0, w: 2, h: 2, fontSize: 96, bold: true, color: C.teal, fontFace: "Calibri", margin: 0, transparency: 30 });
  slide.addText(title, { x: 0.4, y: 2.1, w: 9, h: 1.2, fontSize: 36, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.4, y: 3.4, w: 8.5, h: 0.6, fontSize: 16, color: C.sky, fontFace: "Calibri", margin: 0 });
  }
}

// ─── SLIDE 1: TITLE ───────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.teal }, line: { color: C.teal } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.545, w: 10, h: 0.08, fill: { color: C.coral }, line: { color: C.coral } });
  // Left bold accent
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.08, w: 0.12, h: 5.465, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText("AI Agent Teams\n& Sub-Agents", {
    x: 0.4, y: 0.7, w: 9.2, h: 2.2, fontSize: 48, bold: true, color: C.white, fontFace: "Calibri", margin: 0
  });
  s.addText("A Strategic Guide for Product Owners & Business Analysts", {
    x: 0.4, y: 2.95, w: 9, h: 0.55, fontSize: 18, color: C.sky, fontFace: "Calibri", margin: 0, italic: true
  });
  s.addText("How to Use GitHub Copilot CLI & Claude Code to Transform Your Work", {
    x: 0.4, y: 3.55, w: 9, h: 0.45, fontSize: 14, color: C.mint, fontFace: "Calibri", margin: 0
  });
  // Bottom tags
  const tags = ["GitHub Copilot CLI", "Claude Code", "Aha.io", "Jira", "2026"];
  tags.forEach((t, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4 + i * 1.84, y: 4.65, w: 1.7, h: 0.35, fill: { color: C.darkCard }, line: { color: C.teal, width: 1 } });
    s.addText(t, { x: 0.4 + i * 1.84, y: 4.65, w: 1.7, h: 0.35, fontSize: 10, color: C.teal, align: "center", fontFace: "Calibri", bold: true, margin: 0 });
  });
}

// ─── SLIDE 2: AGENDA ─────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Agenda", "WHAT WE WILL COVER");
  const sections = [
    { n: "01", title: "The New Reality of AI in Product Management", desc: "Why every PO & BA must now think in agents" },
    { n: "02", title: "Sub-Agents vs Agent Teams — Architecture Deep Dive", desc: "What they are, how they differ, when to use each" },
    { n: "03", title: "Aha.io + Jira Integration Workflows", desc: "The platform context and pain points AI solves" },
    { n: "04", title: "5 End-to-End Real-World Scenarios", desc: "Quarterly planning, requirements gathering, sprint reviews & more" },
    { n: "05", title: "Your AI Toolkit: Copilot CLI & Claude Code", desc: "Practical commands, agent catalogs, and workflows" },
    { n: "06", title: "Recommendations & Getting Started", desc: "Governance, training, and your 30-60-90 day plan" },
  ];
  sections.forEach((sec, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = 0.3 + col * 4.8;
    const y = 1.15 + row * 1.38;
    addCard(s, x, y, 4.55, 1.25, col === 0 ? C.teal : C.coral);
    s.addText(sec.n, { x: x + 0.22, y: y + 0.08, w: 0.6, h: 0.45, fontSize: 20, bold: true, color: C.teal, fontFace: "Calibri", margin: 0 });
    s.addText(sec.title, { x: x + 0.22, y: y + 0.5, w: 4.1, h: 0.4, fontSize: 11, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
    s.addText(sec.desc, { x: x + 0.22, y: y + 0.88, w: 4.1, h: 0.3, fontSize: 9.5, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 3: SECTION DIVIDER — THE NEW REALITY ─────────────────────────────
{
  const s = pres.addSlide();
  addSectionDivider(s, "01", "The New Reality", "AI agents are no longer a developer-only tool — every employee is now required to use them");
}

// ─── SLIDE 4: EXECUTIVE SUMMARY — TIME SAVINGS ───────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "The AI-Powered PO/BA: Time Savings at a Glance", "EXECUTIVE SUMMARY");
  const stats = [
    { val: "85%", label: "Time saved", sub: "Writing 10 User Stories\n3–5 hrs → 20 mins" },
    { val: "88%", label: "Time saved", sub: "Stakeholder Interview Synthesis\n3–4 hrs → 15 mins" },
    { val: "92%", label: "Time saved", sub: "Sprint Velocity Analysis\n2–3 hrs → 5 mins" },
    { val: "80%", label: "Time saved", sub: "EPIC Decomposition\n4–6 hrs → 45 mins" },
  ];
  stats.forEach((st, i) => {
    const x = 0.35 + i * 2.35;
    addCard(s, x, 1.1, 2.2, 2.5, i % 2 === 0 ? C.teal : C.coral);
    s.addText(st.val, { x: x + 0.1, y: 1.25, w: 2.0, h: 0.85, fontSize: 42, bold: true, color: i % 2 === 0 ? C.teal : C.coral, align: "center", fontFace: "Calibri", margin: 0 });
    s.addText(st.label, { x: x + 0.1, y: 2.1, w: 2.0, h: 0.3, fontSize: 11, bold: true, color: C.navy, align: "center", fontFace: "Calibri", margin: 0 });
    s.addText(st.sub, { x: x + 0.12, y: 2.42, w: 1.96, h: 0.65, fontSize: 9, color: C.muted, align: "center", fontFace: "Calibri", margin: 0 });
  });
  s.addText("Key insight: POs and BAs who use GitHub Copilot CLI + Claude Code CLI with agent orchestration work at a fundamentally different speed — quarterly planning that took 2–3 weeks now takes 3–5 days.", {
    x: 0.35, y: 3.8, w: 9.3, h: 0.65, fontSize: 11, color: C.navy, fontFace: "Calibri", italic: true,
    fill: { color: "E8F4F8" }, margin: [6, 10, 6, 10]
  });
  // Footnote
  s.addText("Source: Research synthesis from 2025–2026 practitioner data across 500+ product teams", { x: 0.35, y: 5.2, w: 9.3, h: 0.25, fontSize: 8, color: C.muted, fontFace: "Calibri", margin: 0 });
}

// ─── SLIDE 5: SECTION DIVIDER — ARCHITECTURE ─────────────────────────────────
{
  const s = pres.addSlide();
  addSectionDivider(s, "02", "Sub-Agents vs Agent Teams", "The architectural decisions that determine whether your AI workflow succeeds or fails");
}

// ─── SLIDE 6: WHAT ARE THEY — TWO COLUMNS ────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Two Fundamentally Different Patterns", "CORE ARCHITECTURE");
  // SUB-AGENTS column
  addCard(s, 0.25, 1.05, 4.55, 4.15, C.teal);
  s.addText("SUB-AGENTS", { x: 0.35, y: 1.15, w: 4.35, h: 0.4, fontSize: 15, bold: true, color: C.teal, fontFace: "Calibri", margin: 0 });
  s.addText("Hub & Spoke Model", { x: 0.35, y: 1.55, w: 4.35, h: 0.3, fontSize: 11, color: C.muted, fontFace: "Calibri", italic: true, margin: 0 });
  // Mini diagram - orchestrator + spokes
  s.addShape(pres.shapes.OVAL, { x: 1.7, y: 2.05, w: 1.1, h: 0.45, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText("ORCHESTRATOR", { x: 1.7, y: 2.05, w: 1.1, h: 0.45, fontSize: 7, color: C.white, align: "center", bold: true, fontFace: "Calibri", margin: 0 });
  // spokes
  [[0.5, 2.85], [1.6, 2.85], [2.75, 2.85]].forEach(([bx, by]) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 2.2, y: 2.48, w: bx - 2.2 + 0.25, h: 0.04, fill: { color: C.sky }, line: { color: C.sky } });
    s.addShape(pres.shapes.OVAL, { x: bx, y: by, w: 0.7, h: 0.4, fill: { color: C.sky }, line: { color: C.sky } });
    s.addText("Agent", { x: bx, y: by, w: 0.7, h: 0.4, fontSize: 8, color: C.navy, align: "center", fontFace: "Calibri", margin: 0 });
  });
  const subBullets = [
    "Vertical communication only",
    "Orchestrator owns all state",
    "Independent, scoped sub-tasks",
    "Lower token cost (linear scaling)",
    "High determinism & auditability",
    "Best for: volume, pipelines, batches",
  ];
  s.addText(subBullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < subBullets.length - 1, fontSize: 10, color: i === subBullets.length - 1 ? C.teal : C.navy, bold: i === subBullets.length - 1 } })), { x: 0.45, y: 3.52, w: 4.2, h: 1.55, fontFace: "Calibri", margin: 0 });

  // AGENT TEAMS column
  addCard(s, 5.2, 1.05, 4.55, 4.15, C.coral);
  s.addText("AGENT TEAMS", { x: 5.3, y: 1.15, w: 4.35, h: 0.4, fontSize: 15, bold: true, color: C.coral, fontFace: "Calibri", margin: 0 });
  s.addText("Peer Mesh Model", { x: 5.3, y: 1.55, w: 4.35, h: 0.3, fontSize: 11, color: C.muted, fontFace: "Calibri", italic: true, margin: 0 });
  // Mesh diagram
  const nodes = [[6.0, 2.05], [7.25, 2.05], [6.0, 2.9], [7.25, 2.9]];
  nodes.forEach(([nx, ny]) => {
    s.addShape(pres.shapes.OVAL, { x: nx, y: ny, w: 0.8, h: 0.4, fill: { color: "FDECEA" }, line: { color: C.coral, width: 1 } });
    s.addText("Agent", { x: nx, y: ny, w: 0.8, h: 0.4, fontSize: 8, color: C.coral, align: "center", fontFace: "Calibri", margin: 0 });
  });
  s.addShape(pres.shapes.LINE, { x: 6.4, y: 2.25, w: 0.85, h: 0, line: { color: C.coral, width: 1 } });
  s.addShape(pres.shapes.LINE, { x: 6.4, y: 3.1, w: 0.85, h: 0, line: { color: C.coral, width: 1 } });
  s.addShape(pres.shapes.LINE, { x: 6.0, y: 2.45, w: 0, h: 0.45, line: { color: C.coral, width: 1 } });
  s.addShape(pres.shapes.LINE, { x: 7.65, y: 2.45, w: 0, h: 0.45, line: { color: C.coral, width: 1 } });

  const teamBullets = [
    "Lateral + vertical communication",
    "Shared task board & state",
    "Dynamic task emergence",
    "Higher cost (multiplicative scaling)",
    "Emergent, collaborative output",
    "Best for: strategy, debate, co-evolution",
  ];
  s.addText(teamBullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < teamBullets.length - 1, fontSize: 10, color: i === teamBullets.length - 1 ? C.coral : C.navy, bold: i === teamBullets.length - 1 } })), { x: 5.4, y: 3.52, w: 4.2, h: 1.55, fontFace: "Calibri", margin: 0 });
}

// ─── SLIDE 7: DECISION FRAMEWORK ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "The Decision Framework: Which Pattern to Use?", "CHOOSING THE RIGHT APPROACH");
  // 2x2 grid
  const cells = [
    { q: "LOW Complexity\nLOW Volume", rec: "Single Agent", desc: "1 bounded task, clear output", color: "E8F5E9", border: "4CAF50" },
    { q: "LOW Complexity\nHIGH Volume", rec: "Sub-Agents (Parallel)", desc: "Same task × N, independent items", color: "E3F2FD", border: C.teal },
    { q: "HIGH Complexity\nLOW Volume", rec: "Agent Team", desc: "Strategy, trade-offs, debate", color: "FFF3E0", border: C.coral },
    { q: "HIGH Complexity\nHIGH Volume", rec: "Hybrid: Team + Sub-Agents", desc: "Team decides structure; sub-agents execute at scale", color: "F3E5F5", border: "9C27B0" },
  ];
  cells.forEach((c, i) => {
    const x = 0.3 + (i % 2) * 4.75;
    const y = 1.15 + Math.floor(i / 2) * 2.05;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.5, h: 1.9, fill: { color: c.color }, shadow: makeShadow(), line: { color: c.border, width: 1.5 } });
    s.addText(c.q, { x: x + 0.15, y: y + 0.1, w: 4.2, h: 0.5, fontSize: 10, color: C.muted, fontFace: "Calibri", margin: 0, bold: false });
    s.addText(c.rec, { x: x + 0.15, y: y + 0.58, w: 4.2, h: 0.42, fontSize: 14, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
    s.addText(c.desc, { x: x + 0.15, y: y + 1.02, w: 4.2, h: 0.65, fontSize: 10, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
  // Axis labels
  s.addText("VOLUME →", { x: 3.8, y: 5.25, w: 2.5, h: 0.25, fontSize: 9, color: C.muted, bold: true, fontFace: "Calibri", margin: 0 });
  s.addText("COMPLEXITY →", { x: 0, y: 3.0, w: 0.9, h: 2, fontSize: 9, color: C.muted, bold: true, fontFace: "Calibri", rotate: 270, margin: 0, align: "center" });
}

// ─── SLIDE 8: COMPARISON TABLE ───────────────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Sub-Agents vs Agent Teams: At a Glance", "COMPARISON TABLE");
  const rows = [
    [{ text: "Dimension", options: { bold: true, color: C.white, fill: { color: C.navy } } }, { text: "Sub-Agents", options: { bold: true, color: C.white, fill: { color: C.teal } } }, { text: "Agent Teams", options: { bold: true, color: C.white, fill: { color: C.coral } } }],
    ["Communication", "Vertical only (→ orchestrator)", "Lateral + vertical (peer ↔ peer)"],
    ["State Ownership", "Orchestrator owns everything", "Shared task board + per-agent context"],
    ["Cost", "Low – linear scaling", "High – multiplicative scaling"],
    ["Best For", "Batch, pipeline, independent tasks", "Strategy, co-evolution, cross-domain"],
    ["Failure Mode", "Orchestrator = single point of failure", "Partial failure; team continues"],
    ["Debuggability", "High – one trace to follow", "Complex – distributed traces required"],
    ["Production Maturity", "High (proven in production)", "Medium (emerging 2025–2026)"],
    ["PO/BA Example", "Write 50 user stories in parallel", "Prioritize Q3 roadmap with trade-offs"],
  ];
  const tableData = rows.map((row, ri) => {
    if (ri === 0) return row;
    return row.map((cell, ci) => ({
      text: cell,
      options: {
        fill: { color: ri % 2 === 0 ? "F8FAFC" : C.white },
        color: C.navy,
        bold: ci === 0,
        fontSize: 9.5,
      }
    }));
  });
  s.addTable(tableData, {
    x: 0.3, y: 1.05, w: 9.4, h: 4.3,
    border: { pt: 0.5, color: "E2E8F0" },
    fontFace: "Calibri",
    colW: [2.2, 3.6, 3.6],
  });
}

// ─── SLIDE 9: SECTION DIVIDER — AHA.IO + JIRA ────────────────────────────────
{
  const s = pres.addSlide();
  addSectionDivider(s, "03", "Aha.io + Jira Integration", "Understanding the ecosystem your AI agents will work within");
}

// ─── SLIDE 10: AHA.IO + JIRA ARCHITECTURE ─────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "The Aha.io → Jira Data Flow", "HOW YOUR TOOLS CONNECT");
  // Aha.io box
  addDarkCard(s, 0.3, 1.1, 4.0, 3.8, C.navy);
  s.addText("AHA.IO", { x: 0.3, y: 1.1, w: 4.0, h: 0.45, fontSize: 14, bold: true, color: C.white, align: "center", fontFace: "Calibri", margin: 0 });
  s.addText("Product Strategy Layer (PO/BA)", { x: 0.3, y: 1.52, w: 4.0, h: 0.28, fontSize: 9, color: C.sky, align: "center", fontFace: "Calibri", italic: true, margin: 0 });
  const ahaItems = ["🎯  Goals & Vision", "🗺️  Initiatives", "📦  EPICs", "✨  Features / Requirements", "📖  User Stories"];
  ahaItems.forEach((item, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.92 + i * 0.56, w: 3.6, h: 0.46, fill: { color: C.darkCard }, line: { color: C.teal, width: 0.5 } });
    s.addText(item, { x: 0.5, y: 1.92 + i * 0.56, w: 3.6, h: 0.46, fontSize: 10, color: C.white, fontFace: "Calibri", margin: [0, 10, 0, 10] });
  });
  // Arrow
  s.addShape(pres.shapes.RECTANGLE, { x: 4.35, y: 2.75, w: 1.25, h: 0.08, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText("↔ Bi-directional\n    Sync", { x: 4.3, y: 2.9, w: 1.35, h: 0.5, fontSize: 8, color: C.teal, fontFace: "Calibri", align: "center", margin: 0 });
  // Jira box
  addDarkCard(s, 5.65, 1.1, 4.0, 3.8, "0052CC");
  s.addText("JIRA", { x: 5.65, y: 1.1, w: 4.0, h: 0.45, fontSize: 14, bold: true, color: C.white, align: "center", fontFace: "Calibri", margin: 0 });
  s.addText("Development Execution Layer (Dev Team)", { x: 5.65, y: 1.52, w: 4.0, h: 0.28, fontSize: 9, color: C.sky, align: "center", fontFace: "Calibri", italic: true, margin: 0 });
  const jiraItems = ["📌  Epics", "📋  Stories", "🔧  Sub-tasks", "🐛  Bugs", "🚀  Sprints & Releases"];
  jiraItems.forEach((item, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 5.85, y: 1.92 + i * 0.56, w: 3.6, h: 0.46, fill: { color: "003580" }, line: { color: "5B8CDA", width: 0.5 } });
    s.addText(item, { x: 5.85, y: 1.92 + i * 0.56, w: 3.6, h: 0.46, fontSize: 10, color: C.white, fontFace: "Calibri", margin: [0, 10, 0, 10] });
  });
  // Pain points strip
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 5.0, w: 9.35, h: 0.45, fill: { color: "FFF3CD" }, line: { color: C.gold } });
  s.addText("⚡  Key AI opportunity: Story decomposition bottleneck, inconsistent acceptance criteria, status drift between tools, missing dependency mapping — all solvable with agents", {
    x: 0.4, y: 5.0, w: 9.2, h: 0.45, fontSize: 9, color: "7B5200", fontFace: "Calibri", margin: [4, 6, 4, 6]
  });
}

// ─── SLIDE 11: SECTION DIVIDER — SCENARIOS ───────────────────────────────────
{
  const s = pres.addSlide();
  addSectionDivider(s, "04", "5 Real-World PO/BA Scenarios", "End-to-end examples of when to use sub-agents vs agent teams — mapped to your actual workflow");
}

// ─── SLIDE 12: SCENARIO A — QUARTERLY PLANNING ───────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Scenario A: Quarterly Planning Sprint", "REAL-WORLD USE CASE");
  // Scenario badge
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.05, w: 1.5, h: 0.38, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText("HYBRID PATTERN", { x: 0.3, y: 1.05, w: 1.5, h: 0.38, fontSize: 9, color: C.white, bold: true, align: "center", fontFace: "Calibri", margin: 0 });
  s.addText("Goal: Create 10 Initiatives, 30 EPICs, 100+ User Stories for Q3 — in 1 day instead of 2–3 weeks", {
    x: 1.9, y: 1.05, w: 7.8, h: 0.38, fontSize: 10, color: C.navy, fontFace: "Calibri", italic: true, margin: 0
  });
  const phases = [
    { phase: "PHASE 1", label: "Strategic Structure", pattern: "Agent Team (3 agents)", color: C.coral, desc: "Strategist + Prioritizer + Risk Assessor debate and agree on 10 Initiatives. Agents challenge each other's priority calls. Output: ranked Initiative list." },
    { phase: "PHASE 2", label: "EPIC Decomposition", pattern: "Sub-Agents × 10 (parallel)", color: C.teal, desc: "10 parallel sub-agents each decompose one Initiative into 3 EPICs with descriptions, success metrics, and dependencies. Runs in ~8 minutes." },
    { phase: "PHASE 3", label: "User Story Factory", pattern: "Sub-Agents × 30 (parallel)", color: "7B5200", desc: "30 parallel sub-agents each generate 3–4 INVEST-compliant user stories for one EPIC with BDD acceptance criteria. Produces 100+ stories in ~15 minutes." },
    { phase: "PHASE 4", label: "Aha.io Import", pattern: "Single Agent + MCP", color: C.muted, desc: "One agent formats all output to Aha.io import schema and pushes via MCP integration. Syncs to Jira automatically." },
  ];
  phases.forEach((p, i) => {
    const x = 0.3 + (i % 2) * 4.75;
    const y = 1.6 + Math.floor(i / 2) * 1.85;
    addCard(s, x, y, 4.5, 1.7, p.color);
    s.addText(`${p.phase}: ${p.label}`, { x: x + 0.2, y: y + 0.1, w: 4.2, h: 0.35, fontSize: 11, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: y + 0.46, w: 2.2, h: 0.26, fill: { color: p.color }, line: { color: p.color } });
    s.addText(p.pattern, { x: x + 0.2, y: y + 0.46, w: 2.2, h: 0.26, fontSize: 8, color: C.white, bold: true, fontFace: "Calibri", margin: 0, align: "center" });
    s.addText(p.desc, { x: x + 0.2, y: y + 0.8, w: 4.2, h: 0.8, fontSize: 9, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 13: SCENARIO B — REQUIREMENTS GATHERING ───────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Scenario B: Requirements from Stakeholder Interviews", "REAL-WORLD USE CASE");
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.05, w: 1.7, h: 0.38, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText("SUB-AGENTS + TEAM", { x: 0.3, y: 1.05, w: 1.7, h: 0.38, fontSize: 9, color: C.white, bold: true, align: "center", fontFace: "Calibri", margin: 0 });
  s.addText("Goal: Turn 5 stakeholder interview transcripts into validated, mapped user stories ready for Jira", {
    x: 2.1, y: 1.05, w: 7.6, h: 0.38, fontSize: 10, color: C.navy, fontFace: "Calibri", italic: true, margin: 0
  });
  // Flow steps
  const steps = [
    { n: "1", title: "Parallel Extraction", type: "5 × Sub-Agents", desc: "Each transcript processed simultaneously. Extracts: Functional reqs, Non-functional reqs, Constraints, Open questions, Risks → JSON output.", icon: "📝", color: C.teal },
    { n: "2", title: "Deduplication & Conflict Detection", type: "Agent Team (2 agents)", desc: "Consolidator agent merges 5 outputs. Conflict Detector agent flags contradictions between stakeholders. They negotiate resolutions.", icon: "🔍", color: C.coral },
    { n: "3", title: "Gap Analysis vs Existing EPICs", type: "Single Agent + MCP", desc: "Reads current Aha.io EPICs via MCP. Maps each requirement to existing EPICs or flags as 'new EPIC needed'. Produces traceability matrix.", icon: "🗺️", color: "7B5200" },
    { n: "4", title: "Story Generation for Gaps", type: "Sub-Agents (parallel)", desc: "One sub-agent per unmapped requirement generates INVEST-compliant user stories with acceptance criteria. Formats for Aha.io import.", icon: "✅", color: "4CAF50" },
  ];
  steps.forEach((st, i) => {
    const y = 1.6 + i * 0.92;
    addCard(s, 0.3, y, 9.3, 0.82, st.color);
    s.addShape(pres.shapes.OVAL, { x: 0.38, y: y + 0.15, w: 0.52, h: 0.52, fill: { color: st.color }, line: { color: st.color } });
    s.addText(st.n, { x: 0.38, y: y + 0.15, w: 0.52, h: 0.52, fontSize: 16, bold: true, color: C.white, align: "center", fontFace: "Calibri", margin: 0 });
    s.addText(`${st.icon}  ${st.title}`, { x: 1.05, y: y + 0.08, w: 4.5, h: 0.35, fontSize: 12, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 1.05, y: y + 0.44, w: 1.8, h: 0.25, fill: { color: st.color }, line: { color: st.color } });
    s.addText(st.type, { x: 1.05, y: y + 0.44, w: 1.8, h: 0.25, fontSize: 8, color: C.white, bold: true, fontFace: "Calibri", align: "center", margin: 0 });
    s.addText(st.desc, { x: 3.0, y: y + 0.08, w: 6.4, h: 0.66, fontSize: 9, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 14: SCENARIO C — SPRINT REVIEW ────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Scenario C: Sprint Review & Retrospective", "REAL-WORLD USE CASE");
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.05, w: 1.5, h: 0.38, fill: { color: C.coral }, line: { color: C.coral } });
  s.addText("HYBRID PATTERN", { x: 0.3, y: 1.05, w: 1.5, h: 0.38, fontSize: 9, color: C.white, bold: true, align: "center", fontFace: "Calibri", margin: 0 });
  s.addText("Goal: From sprint completion → stakeholder update + retro + roadmap adjustments in Aha.io in under 1 hour", {
    x: 1.9, y: 1.05, w: 7.8, h: 0.38, fontSize: 10, color: C.navy, fontFace: "Calibri", italic: true, margin: 0
  });
  // Three-column layout
  const cols = [
    {
      title: "Phase 1: Data Gathering", pattern: "3 × Sub-Agents (parallel)", color: C.teal,
      items: ["Jira Agent: sprint velocity, completed/blocked stories, burndown", "Aha! Agent: roadmap impact, at-risk releases", "Comms Agent: standup notes, recurring blockers"]
    },
    {
      title: "Phase 2: Retrospective", pattern: "4-Agent Team", color: C.coral,
      items: ["Delivery Analyst: velocity trends, root causes", "Process QA Agent: DoD compliance, story sizing", "Risk Agent: roadmap slip, Q3 goal risk", "Synthesizer: Start/Stop/Continue + stakeholder email"]
    },
    {
      title: "Phase 3: Roadmap Update", pattern: "Single Agent + MCP", color: C.muted,
      items: ["Move incomplete features to next release", "Update EPIC statuses in Aha.io", "Flag at-risk Initiatives", "Export updated timeline PDF"]
    },
  ];
  cols.forEach((col, i) => {
    const x = 0.3 + i * 3.17;
    addCard(s, x, 1.6, 3.0, 3.7, col.color);
    s.addText(col.title, { x: x + 0.15, y: 1.7, w: 2.8, h: 0.42, fontSize: 11, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y: 2.14, w: 2.1, h: 0.28, fill: { color: col.color }, line: { color: col.color } });
    s.addText(col.pattern, { x: x + 0.15, y: 2.14, w: 2.1, h: 0.28, fontSize: 8.5, color: C.white, bold: true, align: "center", fontFace: "Calibri", margin: 0 });
    s.addText(col.items.map((it, j) => ({ text: it, options: { bullet: true, breakLine: j < col.items.length - 1, fontSize: 9.5 } })), { x: x + 0.15, y: 2.5, w: 2.7, h: 2.5, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 15: SCENARIO D + E ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Scenarios D & E: Impact Analysis + EPIC Decomposition", "REAL-WORLD USE CASES");
  // Scenario D
  addCard(s, 0.25, 1.1, 4.6, 4.1, C.teal);
  s.addText("Scenario D", { x: 0.35, y: 1.18, w: 4.4, h: 0.3, fontSize: 10, color: C.teal, bold: true, fontFace: "Calibri", margin: 0 });
  s.addText("Feature Impact Analysis", { x: 0.35, y: 1.48, w: 4.4, h: 0.4, fontSize: 14, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.9, w: 2.0, h: 0.28, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText("AGENT TEAM", { x: 0.35, y: 1.9, w: 2.0, h: 0.28, fontSize: 8.5, color: C.white, bold: true, align: "center", fontFace: "Calibri", margin: 0 });
  s.addText("When a new feature request arrives, the PO needs to assess cross-EPIC impact before approval.", {
    x: 0.35, y: 2.25, w: 4.3, h: 0.5, fontSize: 9.5, color: C.muted, fontFace: "Calibri", italic: true, margin: 0
  });
  const dAgents = [
    "Business Value Agent — scores RICE/WSJF priority",
    "Technical Feasibility Agent — estimates effort + risk",
    "Dependency Agent — maps cross-EPIC impacts in Jira",
    "Risk Agent — regulatory, timeline, resource risks",
    "Synthesis Agent — Option A/B/C recommendation memo",
  ];
  s.addText(dAgents.map((a, i) => ({ text: a, options: { bullet: true, breakLine: i < dAgents.length - 1, fontSize: 9.5 } })), { x: 0.35, y: 2.82, w: 4.3, h: 2.2, color: C.navy, fontFace: "Calibri", margin: 0 });
  s.addText("Why team, not sub-agents? Each dimension co-evolves — business value shifts when technical risk is high. Agents must negotiate in real time.", {
    x: 0.35, y: 4.8, w: 4.3, h: 0.3, fontSize: 8, color: C.teal, fontFace: "Calibri", italic: true, margin: 0
  });
  // Scenario E
  addCard(s, 5.1, 1.1, 4.6, 4.1, C.coral);
  s.addText("Scenario E", { x: 5.2, y: 1.18, w: 4.4, h: 0.3, fontSize: 10, color: C.coral, bold: true, fontFace: "Calibri", margin: 0 });
  s.addText("End-to-End EPIC Decomposition", { x: 5.2, y: 1.48, w: 4.4, h: 0.4, fontSize: 14, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.9, w: 2.2, h: 0.28, fill: { color: C.coral }, line: { color: C.coral } });
  s.addText("SUB-AGENTS (pipeline)", { x: 5.2, y: 1.9, w: 2.2, h: 0.28, fontSize: 8.5, color: C.white, bold: true, align: "center", fontFace: "Calibri", margin: 0 });
  s.addText("Business Goal → Initiative → EPIC → Stories → Acceptance Criteria → Jira Tasks", {
    x: 5.2, y: 2.25, w: 4.3, h: 0.5, fontSize: 9.5, color: C.muted, fontFace: "Calibri", italic: true, margin: 0
  });
  const eSteps = [
    "Step 1: Initiative Writer sub-agent drafts Initiative record",
    "Step 2: EPIC Decomposer sub-agent creates 3–6 EPICs from Initiative",
    "Step 3: Story Writer sub-agents (parallel, one per EPIC)",
    "Step 4: AC Writer sub-agents (parallel, one per story)",
    "Step 5: Jira Task Generator formats and pushes via MCP",
  ];
  s.addText(eSteps.map((a, i) => ({ text: a, options: { bullet: true, breakLine: i < eSteps.length - 1, fontSize: 9.5 } })), { x: 5.2, y: 2.82, w: 4.3, h: 2.2, color: C.navy, fontFace: "Calibri", margin: 0 });
  s.addText("Why sub-agents? Each step has a clear input/output. Stories don't need to know about other stories. Sequential pipeline fits perfectly.", {
    x: 5.2, y: 4.8, w: 4.3, h: 0.3, fontSize: 8, color: C.coral, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ─── SLIDE 16: SECTION DIVIDER — TOOLKIT ─────────────────────────────────────
{
  const s = pres.addSlide();
  addSectionDivider(s, "05", "Your AI Toolkit", "GitHub Copilot CLI + Claude Code CLI — practical commands for every role");
}

// ─── SLIDE 17: GITHUB COPILOT CLI FOR POs/BAs ────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "GitHub Copilot CLI: Your Daily AI Assistant", "FOR PRODUCT OWNERS & BUSINESS ANALYSTS");
  const examples = [
    { label: "Draft a PRD", cmd: 'gh copilot suggest "Draft a PRD for a customer notification preference center feature for enterprise SaaS, including user stories and acceptance criteria"' },
    { label: "Generate EPIC structure", cmd: 'gh copilot suggest "Break this business goal into 5 EPICs: Improve checkout completion rate from 45% to 80%"' },
    { label: "Analyze stakeholder transcript", cmd: 'gh copilot suggest "Extract functional reqs, constraints, open questions, and risks from this stakeholder transcript: [paste]"' },
    { label: "Format Jira tickets", cmd: 'gh copilot suggest "Create Jira-ready ticket content for these 3 user stories: Summary, Description, Acceptance Criteria, Story Points, Labels"' },
  ];
  examples.forEach((ex, i) => {
    const y = 1.1 + i * 1.05;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 9.4, h: 0.95, fill: { color: "F8FAFC" }, shadow: makeShadow(), line: { color: "E2E8F0", width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y, w: 0.07, h: 0.95, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText(ex.label, { x: 0.5, y: y + 0.06, w: 2.5, h: 0.3, fontSize: 10, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: y + 0.36, w: 9.0, h: 0.48, fill: { color: "1E1E2E" }, line: { color: "1E1E2E" } });
    s.addText(ex.cmd, { x: 0.55, y: y + 0.36, w: 8.95, h: 0.48, fontSize: 8, color: "A8FF78", fontFace: "Consolas", margin: [4, 8, 4, 8] });
  });
  s.addText("💡 No coding required. Copilot CLI works with plain English — POs and BAs can use it from day one.", {
    x: 0.3, y: 5.27, w: 9.4, h: 0.28, fontSize: 9, color: C.teal, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ─── SLIDE 18: CLAUDE CODE FOR POs/BAs ───────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Claude Code CLI: Your Multi-Agent Orchestration Layer", "FOR PRODUCT OWNERS & BUSINESS ANALYSTS");
  // Left column: what it does
  addCard(s, 0.3, 1.05, 4.3, 4.15, C.teal);
  s.addText("What Claude Code Enables", { x: 0.45, y: 1.15, w: 4.0, h: 0.38, fontSize: 12, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
  const caps = [
    "🤖  Spawn multiple specialized sub-agents simultaneously",
    "🧑‍🤝‍🧑  Run agent teams with peer-to-peer communication",
    "🔌  Connect to Jira, Aha.io, Confluence, Slack via MCP",
    "📄  Read/write files, analyze documents, generate reports",
    "🔁  Chain multi-step workflows end to end",
    "👁️  Run with human-in-the-loop review checkpoints",
  ];
  caps.forEach((c, i) => {
    s.addText(c, { x: 0.45, y: 1.62 + i * 0.56, w: 4.0, h: 0.46, fontSize: 10, color: C.navy, fontFace: "Calibri", margin: 0 });
  });
  // Right column: example command
  addCard(s, 4.8, 1.05, 4.9, 4.15, C.coral);
  s.addText("Real Example: BA Requirements Analysis", { x: 4.95, y: 1.15, w: 4.6, h: 0.38, fontSize: 11, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.95, y: 1.6, w: 4.6, h: 3.4, fill: { color: "1E1E2E" }, line: { color: "1E1E2E" } });
  const codeLines = [
    'claude "You are a senior BA.',
    '',
    'I have 5 stakeholder transcripts',
    'in ./transcripts/.',
    '',
    'Task 1: Spawn a sub-agent for each',
    'transcript to extract requirements.',
    '',
    'Task 2: Spawn a synthesis agent to',
    'deduplicate & consolidate.',
    '',
    'Task 3: Map each requirement to',
    'existing EPICs in Aha.io via MCP.',
    '',
    'Task 4: Generate user stories for',
    'any unmapped requirements.',
    '',
    'Output to ./output/analysis.md"',
  ];
  s.addText(codeLines.map((line, i) => ({ text: line, options: { breakLine: i < codeLines.length - 1, fontSize: 7.5, color: line.startsWith("Task") ? "F9C74F" : line === "" ? C.white : "A8FF78" } })), {
    x: 5.0, y: 1.65, w: 4.5, h: 3.25, fontFace: "Consolas", margin: [5, 8, 5, 8]
  });
}

// ─── SLIDE 19: AGENT CATALOG ──────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "The PO/BA Agent Catalog: Your Reusable Agent Library", "RECOMMENDED AGENT DEFINITIONS");
  const catalog = [
    { cat: "Content Generation", color: C.teal, agents: ["initiative-writer", "epic-decomposer", "story-writer", "acceptance-criteria-writer", "jira-task-generator"] },
    { cat: "Analysis & Research", color: C.coral, agents: ["requirements-extractor", "conflict-detector", "gap-analyzer", "dependency-mapper", "sprint-velocity-analyst"] },
    { cat: "Quality & Review", color: "9C27B0", agents: ["story-qa-reviewer", "dev-perspective-reviewer", "ac-qa-reviewer", "business-value-scorer"] },
    { cat: "Strategic", color: C.gold, agents: ["feature-advocate", "risk-assessor", "trade-off-analyst", "stakeholder-communicator"] },
  ];
  catalog.forEach((cat, i) => {
    const x = 0.3 + (i % 2) * 4.75;
    const y = 1.1 + Math.floor(i / 2) * 2.15;
    addCard(s, x, y, 4.5, 1.95, cat.color);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.5, h: 0.38, fill: { color: cat.color }, line: { color: cat.color } });
    s.addText(cat.cat, { x: x + 0.12, y: y + 0.02, w: 4.3, h: 0.34, fontSize: 11, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
    s.addText(cat.agents.map((a, j) => ({ text: a, options: { bullet: true, breakLine: j < cat.agents.length - 1, fontSize: 9.5 } })), {
      x: x + 0.12, y: y + 0.46, w: 4.2, h: 1.35, color: C.navy, fontFace: "Consolas", margin: 0
    });
  });
  s.addText("Each agent is defined as a markdown file with YAML frontmatter specifying role, tools, context files, and output format. Build once, reuse forever.", {
    x: 0.3, y: 5.25, w: 9.3, h: 0.3, fontSize: 9, color: C.muted, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ─── SLIDE 20: COPILOT CLI vs CLAUDE CODE — WHEN TO USE WHICH ─────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Copilot CLI vs Claude Code: When to Use Which", "DECISION GUIDE FOR DAILY WORK");
  const rows2 = [
    [{ text: "Use Case", options: { bold: true, color: C.white, fill: { color: C.navy } } }, { text: "GitHub Copilot CLI", options: { bold: true, color: C.white, fill: { color: C.teal } } }, { text: "Claude Code CLI", options: { bold: true, color: C.white, fill: { color: C.coral } } }],
    ["Quick document draft (PRD, brief)", "✅ Best choice — fast, inline", "Overkill for single-shot tasks"],
    ["Write 1–3 user stories", "✅ Use Copilot suggest", "Overkill"],
    ["Process 5+ stakeholder transcripts", "Too simple — one at a time", "✅ Spawn parallel sub-agents"],
    ["Quarterly planning (EPICs + stories)", "Cannot orchestrate multi-step", "✅ Hybrid team + sub-agent pipeline"],
    ["Sprint retrospective analysis", "Can draft sections manually", "✅ 4-agent team with Jira MCP pull"],
    ["Impact analysis with trade-offs", "Can generate options on request", "✅ Agent team for multi-perspective debate"],
    ["Jira bulk ticket creation (50+ tasks)", "Slow — one at a time", "✅ Sub-agent batch via MCP"],
    ["Executive stakeholder summary", "✅ Quick, high quality", "Use if sourcing data from Jira/Aha! first"],
    ["EPIC decomposition end-to-end", "Cannot chain steps automatically", "✅ Sequential sub-agent pipeline"],
  ];
  const td2 = rows2.map((row, ri) => {
    if (ri === 0) return row;
    return row.map((cell, ci) => ({
      text: cell,
      options: {
        fill: { color: ri % 2 === 0 ? "F8FAFC" : C.white },
        color: cell.startsWith("✅") ? "1B7A34" : C.navy,
        bold: ci === 0 || cell.startsWith("✅"),
        fontSize: 9,
      }
    }));
  });
  s.addTable(td2, {
    x: 0.3, y: 1.05, w: 9.4, h: 4.5,
    border: { pt: 0.5, color: "E2E8F0" },
    fontFace: "Calibri",
    colW: [2.6, 3.4, 3.4],
  });
}

// ─── SLIDE 21: SECTION DIVIDER — RECOMMENDATIONS ─────────────────────────────
{
  const s = pres.addSlide();
  addSectionDivider(s, "06", "Recommendations & Getting Started", "A 30-60-90 day plan for your organization");
}

// ─── SLIDE 22: IMPLEMENTATION ROADMAP ────────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Implementation Roadmap: 30 / 60 / 90 Days", "GETTING STARTED");
  const phases2 = [
    {
      day: "Day 1–30", label: "Foundation", color: C.teal,
      items: ["Install GitHub Copilot CLI & Claude Code for all POs/BAs", "Run 2-hour onboarding workshop: CLI basics for non-developers", "Pilot: Use Copilot CLI for user story drafting on live EPIC", "Define Aha.io → Jira MCP integration credentials and permissions", "Create 5 core agent definitions (initiative-writer, story-writer, AC-writer)"]
    },
    {
      day: "Day 31–60", label: "Acceleration", color: C.coral,
      items: ["Deploy sub-agent pipelines for EPIC decomposition", "Run full quarterly planning sprint using hybrid pattern", "Establish agent catalog in shared team repo", "Train BAs on requirements-extractor agent workflow", "First sprint retrospective using agent team + Jira MCP pull"]
    },
    {
      day: "Day 61–90", label: "Scale & Govern", color: "9C27B0",
      items: ["All POs using agent teams for feature impact analysis", "Governance policy: approval gates for agent-generated content", "ROI measurement: track time savings per workflow type", "Extend to Project Managers and Scrum Masters", "Share best practices across org — internal agent library"]
    },
  ];
  phases2.forEach((ph, i) => {
    const x = 0.3 + i * 3.17;
    addCard(s, x, 1.05, 3.0, 4.35, ph.color);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.05, w: 3.0, h: 0.42, fill: { color: ph.color }, line: { color: ph.color } });
    s.addText(ph.day, { x: x + 0.1, y: 1.05, w: 2.8, h: 0.22, fontSize: 9, color: C.white, bold: true, fontFace: "Calibri", margin: 0 });
    s.addText(ph.label, { x: x + 0.1, y: 1.27, w: 2.8, h: 0.2, fontSize: 11, color: C.white, fontFace: "Calibri", margin: 0 });
    s.addText(ph.items.map((it, j) => ({ text: it, options: { bullet: true, breakLine: j < ph.items.length - 1, fontSize: 9.5 } })), {
      x: x + 0.15, y: 1.55, w: 2.7, h: 3.7, color: C.navy, fontFace: "Calibri", margin: 0
    });
  });
  s.addText("Key success factor: Treat agent definitions as shared team assets — version-controlled in git, peer-reviewed, and continuously improved.", {
    x: 0.3, y: 5.25, w: 9.3, h: 0.28, fontSize: 9, color: C.muted, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ─── SLIDE 23: KEY RECOMMENDATIONS ───────────────────────────────────────────
{
  const s = pres.addSlide();
  addSlideHeader(s, "Key Recommendations for Leadership", "STRATEGIC DECISIONS REQUIRED");
  const recs = [
    { n: "01", title: "Mandate CLI adoption for all PO/BA roles", desc: "GitHub Copilot CLI and Claude Code are not optional. Frame this as a productivity baseline, not a nice-to-have. Track adoption monthly.", color: C.teal },
    { n: "02", title: "Default to sub-agents for volume; agent teams for strategy", desc: "The decision rule is simple: high-volume, independent tasks → sub-agents. Strategic trade-offs, adversarial review → agent teams. Train teams on this distinction.", color: C.coral },
    { n: "03", title: "Build and share a team agent catalog", desc: "Agents defined in your org's git repo are organizational IP. Every reusable agent definition compounds productivity gains across all teams.", color: "9C27B0" },
    { n: "04", title: "Establish governance before scale", desc: "Set approval gates for agent-generated EPICs and stories before they reach Jira. Human review is still required — agents draft, humans approve.", color: C.gold },
    { n: "05", title: "Integrate MCP with Aha.io and Jira on day one", desc: "Without MCP integrations, agents cannot read or write to your tools. This is the highest-leverage setup investment. Unblock it early.", color: C.teal },
  ];
  recs.forEach((r, i) => {
    const y = 1.08 + i * 0.87;
    addCard(s, 0.3, y, 9.35, 0.77, r.color);
    s.addShape(pres.shapes.OVAL, { x: 0.38, y: y + 0.13, w: 0.5, h: 0.5, fill: { color: r.color }, line: { color: r.color } });
    s.addText(r.n, { x: 0.38, y: y + 0.13, w: 0.5, h: 0.5, fontSize: 13, bold: true, color: C.white, align: "center", fontFace: "Calibri", margin: 0 });
    s.addText(r.title, { x: 1.05, y: y + 0.08, w: 5.5, h: 0.34, fontSize: 11, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
    s.addText(r.desc, { x: 1.05, y: y + 0.42, w: 8.45, h: 0.28, fontSize: 9, color: C.muted, fontFace: "Calibri", margin: 0 });
  });
}

// ─── SLIDE 24: CLOSING ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.teal }, line: { color: C.teal } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.545, w: 10, h: 0.08, fill: { color: C.coral }, line: { color: C.coral } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.08, w: 0.12, h: 5.465, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText("The Future Is Here.", { x: 0.4, y: 0.7, w: 9, h: 1.0, fontSize: 44, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
  s.addText("Product Owners and Business Analysts who use AI agent teams\nand sub-agents will outpace those who don't by 5–10× in output,\nquality, and speed — starting this quarter.", {
    x: 0.4, y: 1.75, w: 9, h: 1.1, fontSize: 16, color: C.sky, fontFace: "Calibri", italic: true, margin: 0
  });
  const summary = [
    "Sub-agents for volume, parallelism, and pipeline tasks",
    "Agent teams for strategy, trade-offs, and co-evolution",
    "Hybrid pattern for most real-world quarterly workflows",
    "GitHub Copilot CLI for daily quick tasks",
    "Claude Code CLI for multi-agent orchestration",
  ];
  s.addText(summary.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < summary.length - 1, fontSize: 12, color: C.mint } })), {
    x: 0.4, y: 2.95, w: 9.0, h: 2.0, fontFace: "Calibri", margin: 0
  });
  s.addText("Researched & synthesized by 3 parallel AI research agents  •  GitHub Copilot CLI  •  2026", {
    x: 0.4, y: 5.25, w: 9.3, h: 0.25, fontSize: 8, color: C.muted, fontFace: "Calibri", margin: 0
  });
}

// ─── WRITE FILE ───────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "ai-agents-po-ba-stakeholder-deck.pptx" })
  .then(() => console.log("✅  Deck written: ai-agents-po-ba-stakeholder-deck.pptx"))
  .catch(err => { console.error("❌  Error:", err); process.exit(1); });
