/**
 * Demo: AI Agent Skills Presentation
 *
 * Generates a 5-slide deck using pptxgenjs following the SKILL.md
 * design guidelines (Ocean Gradient palette, varied layouts, no accent lines).
 *
 * Usage: npm install pptxgenjs && node demo-presentation.js
 * Output: ai_agent_skills_deck.pptx
 */

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "AI Skills Team";
pres.title = "The Rise of AI Agent Skills";

// --- Palette: Ocean Gradient ---
const DEEP_BLUE = "065A82";
const TEAL = "1C7293";
const MIDNIGHT = "21295C";
const WHITE = "FFFFFF";
const LIGHT_BG = "F0F4F8";
const MUTED = "64748B";

// Factory functions to avoid pptxgenjs object mutation bug
const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.15 });

// ============================================================
// SLIDE 1 — Title (dark background, centered text)
// ============================================================
const slide1 = pres.addSlide();
slide1.background = { color: MIDNIGHT };

slide1.addText("The Rise of AI Agent Skills", {
  x: 0.8, y: 1.2, w: 8.4, h: 1.5,
  fontSize: 40, fontFace: "Georgia", bold: true,
  color: WHITE, align: "left", margin: 0
});

slide1.addText("How Prompt Templates Are Changing the Way Agents Work", {
  x: 0.8, y: 2.8, w: 7, h: 0.8,
  fontSize: 18, fontFace: "Calibri",
  color: TEAL, align: "left", margin: 0
});

slide1.addText("March 2026", {
  x: 0.8, y: 4.2, w: 3, h: 0.5,
  fontSize: 14, fontFace: "Calibri",
  color: MUTED, align: "left", margin: 0
});

// Decorative shape — side bar
slide1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.15, h: 5.625,
  fill: { color: TEAL }
});

// ============================================================
// SLIDE 2 — What Are Agent Skills? (two-column layout)
// ============================================================
const slide2 = pres.addSlide();
slide2.background = { color: LIGHT_BG };

slide2.addText("What Are Agent Skills?", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.8,
  fontSize: 32, fontFace: "Georgia", bold: true,
  color: MIDNIGHT, align: "left", margin: 0
});

// Left column — description
slide2.addText(
  "Agent skills are modular packages of instructions that teach AI agents how to perform specialized tasks. " +
  "They are loaded into context on demand — only when the agent determines the skill is relevant to your prompt.",
  {
    x: 0.8, y: 1.5, w: 4.2, h: 2.0,
    fontSize: 14, fontFace: "Calibri", color: "334155",
    align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0
  }
);

// Right column — key traits as cards
const traits = [
  { title: "Modular", desc: "Each skill is a self-contained directory" },
  { title: "Conditional", desc: "Loaded only when relevant" },
  { title: "Portable", desc: "Works across Copilot, Claude, VS Code" },
  { title: "Composable", desc: "Multiple skills can combine" },
];

traits.forEach((trait, i) => {
  const yPos = 1.5 + i * 0.9;
  // Card background
  slide2.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: yPos, w: 4.0, h: 0.75,
    fill: { color: WHITE }, shadow: makeShadow()
  });
  // Accent bar
  slide2.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: yPos, w: 0.08, h: 0.75,
    fill: { color: DEEP_BLUE }
  });
  // Text
  slide2.addText([
    { text: trait.title, options: { bold: true, fontSize: 13, color: MIDNIGHT, breakLine: true } },
    { text: trait.desc, options: { fontSize: 11, color: MUTED } }
  ], { x: 5.75, y: yPos + 0.08, w: 3.6, h: 0.6, fontFace: "Calibri", margin: 0 });
});

// ============================================================
// SLIDE 3 — Comparison (table slide)
// ============================================================
const slide3 = pres.addSlide();
slide3.background = { color: WHITE };

slide3.addText("Skill Approaches Compared", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.8,
  fontSize: 32, fontFace: "Georgia", bold: true,
  color: MIDNIGHT, align: "left", margin: 0
});

const headerOpts = { fill: { color: DEEP_BLUE }, color: WHITE, bold: true, fontSize: 12, fontFace: "Calibri" };
const cellOpts = { fontSize: 11, fontFace: "Calibri", color: "334155" };
const altRow = { fill: { color: "F0F7FF" } };

slide3.addTable([
  [
    { text: "Dimension", options: headerOpts },
    { text: "Prompt Templates", options: headerOpts },
    { text: "Tool-Based", options: headerOpts },
    { text: "Fine-Tuned", options: headerOpts },
  ],
  [
    { text: "Setup Cost", options: { ...cellOpts, bold: true } },
    { text: "Very Low", options: cellOpts },
    { text: "Medium", options: cellOpts },
    { text: "Very High", options: cellOpts },
  ],
  [
    { text: "Iteration Speed", options: { ...cellOpts, ...altRow, bold: true } },
    { text: "Instant", options: { ...cellOpts, ...altRow } },
    { text: "Fast", options: { ...cellOpts, ...altRow } },
    { text: "Slow (retrain)", options: { ...cellOpts, ...altRow } },
  ],
  [
    { text: "Context Cost", options: { ...cellOpts, bold: true } },
    { text: "High", options: cellOpts },
    { text: "Low", options: cellOpts },
    { text: "None", options: cellOpts },
  ],
  [
    { text: "Portability", options: { ...cellOpts, ...altRow, bold: true } },
    { text: "Excellent", options: { ...cellOpts, ...altRow } },
    { text: "Framework-specific", options: { ...cellOpts, ...altRow } },
    { text: "Model-specific", options: { ...cellOpts, ...altRow } },
  ],
  [
    { text: "Auditability", options: { ...cellOpts, bold: true } },
    { text: "High (readable text)", options: cellOpts },
    { text: "Medium (schemas)", options: cellOpts },
    { text: "Low (weights)", options: cellOpts },
  ],
], {
  x: 0.8, y: 1.5, w: 8.4,
  colW: [1.8, 2.2, 2.2, 2.2],
  border: { pt: 0.5, color: "CBD5E1" },
  rowH: [0.45, 0.4, 0.4, 0.4, 0.4, 0.4],
  margin: [0.05, 0.15, 0.05, 0.15],
});

// ============================================================
// SLIDE 4 — Key Stats (big number callouts)
// ============================================================
const slide4 = pres.addSlide();
slide4.background = { color: MIDNIGHT };

slide4.addText("By the Numbers", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.8,
  fontSize: 32, fontFace: "Georgia", bold: true,
  color: WHITE, align: "left", margin: 0
});

const stats = [
  { num: "3", label: "Agent frameworks\nshare one skill format" },
  { num: "0", label: "Infrastructure\nrequired" },
  { num: "<1s", label: "To update\na skill" },
];

stats.forEach((stat, i) => {
  const xPos = 0.8 + i * 3.1;
  // Card
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: xPos, y: 1.6, w: 2.8, h: 3.2,
    fill: { color: DEEP_BLUE }, shadow: makeShadow()
  });
  // Big number
  slide4.addText(stat.num, {
    x: xPos, y: 1.8, w: 2.8, h: 1.5,
    fontSize: 64, fontFace: "Georgia", bold: true,
    color: TEAL, align: "center", valign: "middle", margin: 0
  });
  // Label
  slide4.addText(stat.label, {
    x: xPos + 0.3, y: 3.3, w: 2.2, h: 1.2,
    fontSize: 13, fontFace: "Calibri",
    color: "94A3B8", align: "center", valign: "top",
    lineSpacingMultiple: 1.3, margin: 0
  });
});

// ============================================================
// SLIDE 5 — Closing / Takeaway (dark, centered)
// ============================================================
const slide5 = pres.addSlide();
slide5.background = { color: MIDNIGHT };

// Decorative top bar
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.08,
  fill: { color: TEAL }
});

slide5.addText("Skills are just text.\nThe knowledge is portable.\nAny agent can use them.", {
  x: 1.5, y: 1.2, w: 7, h: 2.5,
  fontSize: 28, fontFace: "Georgia", bold: true,
  color: WHITE, align: "center", valign: "middle",
  lineSpacingMultiple: 1.5, margin: 0
});

slide5.addText("Start building: .github/skills/your-skill/SKILL.md", {
  x: 1.5, y: 4.0, w: 7, h: 0.6,
  fontSize: 16, fontFace: "Calibri",
  color: TEAL, align: "center", margin: 0
});

// --- Write the file ---
pres.writeFile({ fileName: "ai_agent_skills_deck.pptx" }).then(() => {
  const fs = require("fs");
  const size = (fs.statSync("ai_agent_skills_deck.pptx").size / 1024).toFixed(1);
  console.log(`Created: ai_agent_skills_deck.pptx (${size} KB)`);
});
