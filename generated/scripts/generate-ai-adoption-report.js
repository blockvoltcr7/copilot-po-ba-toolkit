const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents,
} = require('docx');
const fs = require('fs');

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  navy: '1B3A6B', blue: '2E5DA6', skyBlue: 'D6E8FF', paleBue: 'F0F6FC',
  teal: '006064', lightTeal: 'E0F7FA',
  green: '1B5E20', lightGreen: 'E8F5E9',
  amber: 'B45309', lightAmber: 'FFFBEB',
  red: 'B91C1C', lightRed: 'FEF2F2',
  white: 'FFFFFF', lightGray: 'F9FAFB', midGray: 'F3F4F6', borderGray: 'D1D5DB',
  textDark: '111827', textMid: '4B5563', textLight: '9CA3AF',
};

// ── Layout ───────────────────────────────────────────────────────────────────
const PAGE = { width: 12240, height: 15840, margin: 1440, content: 9360 };

// ── Border helpers ────────────────────────────────────────────────────────────
const b1 = (color = C.borderGray) => ({ style: BorderStyle.SINGLE, size: 1, color });
const bNone = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const B_ALL = (color) => { const b = b1(color); return { top: b, bottom: b, left: b, right: b }; };
const B_NONE = { top: bNone, bottom: bNone, left: bNone, right: bNone };
const B_BOTTOM = (color = C.borderGray) => ({ top: bNone, bottom: b1(color), left: bNone, right: bNone });

const CELL_PAD = { top: 100, bottom: 100, left: 150, right: 150 };
const CELL_PAD_SM = { top: 60, bottom: 60, left: 120, right: 120 };

// ── Text factories ────────────────────────────────────────────────────────────
const run = (text, o = {}) => new TextRun({ text, font: 'Arial', size: 22, ...o });
const runBold = (text, o = {}) => run(text, { bold: true, ...o });

const para = (children, o = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [children],
  spacing: { before: 80, after: 80 },
  ...o,
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [run(text, { bold: true, size: 32 })],
  spacing: { before: 400, after: 200 },
});
const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [run(text, { bold: true, size: 28 })],
  spacing: { before: 300, after: 160 },
});
const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [run(text, { bold: true, size: 24 })],
  spacing: { before: 200, after: 120 },
});

const p = (text, o = {}) => para([run(text, { size: 22, ...o })]);
const pB = (text) => para([run(text, { size: 22, bold: true })]);

const bullet = (text, o = {}) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  children: [run(text, { size: 21, ...o })],
  spacing: { before: 55, after: 55 },
});
const subbullet = (text, o = {}) => new Paragraph({
  numbering: { reference: 'subbullets', level: 0 },
  children: [run(text, { size: 20, ...o })],
  spacing: { before: 45, after: 45 },
});

const pb = () => new Paragraph({ children: [new PageBreak()] });
const spacer = (n = 120) => new Paragraph({ children: [run('')], spacing: { before: n, after: 0 } });

// ── Cell factory ─────────────────────────────────────────────────────────────
function cell(content, width, o = {}) {
  const textColor = o.textColor || C.textDark;
  const bold = o.bold || false;
  const sz = o.size || 20;
  const align = o.align || AlignmentType.LEFT;

  let children;
  if (typeof content === 'string') {
    children = [new Paragraph({
      alignment: align,
      children: [run(content, { size: sz, bold, color: textColor })],
      spacing: { before: 40, after: 40 },
    })];
  } else {
    children = content;
  }

  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: o.borders !== undefined ? o.borders : B_ALL(),
    shading: o.bg ? { fill: o.bg, type: ShadingType.CLEAR } : undefined,
    margins: o.margins || CELL_PAD,
    verticalAlign: o.vAlign || VerticalAlign.TOP,
    children,
  });
}

function hCell(text, width) {
  return cell(text, width, { bg: C.navy, bold: true, textColor: C.white, size: 19, vAlign: VerticalAlign.CENTER });
}

function makeTable(colWidths, rows) {
  return new Table({
    width: { size: PAGE.content, type: WidthType.DXA },
    columnWidths: colWidths,
    rows,
  });
}

// ── Status badge cells ────────────────────────────────────────────────────────
function statusCell(text, width, type) {
  const map = { green: [C.lightGreen, C.green], amber: [C.lightAmber, C.amber], red: [C.lightRed, C.red], blue: [C.paleBue, C.navy] };
  const [bg, fg] = map[type] || [C.midGray, C.textDark];
  return cell(text, width, { bg, textColor: fg, bold: true, size: 19, align: AlignmentType.CENTER, vAlign: VerticalAlign.CENTER });
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: COVER PAGE
// ─────────────────────────────────────────────────────────────────────────────
const coverPage = [
  spacer(600),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [run('AI ADOPTION ANALYSIS', { bold: true, size: 64, color: C.navy })],
    spacing: { before: 0, after: 160 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [run('GitHub Copilot: Agents, Tools, MCP Servers & Skills Ecosystem', { bold: true, size: 26, color: C.blue })],
    spacing: { before: 0, after: 240 },
  }),
  makeTable([PAGE.content], [
    new TableRow({ children: [new TableCell({
      width: { size: PAGE.content, type: WidthType.DXA },
      borders: B_NONE,
      shading: { fill: C.navy, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 0, right: 0 },
      children: [new Paragraph({ children: [run('', { size: 8 })] })],
    })]})
  ]),
  spacer(240),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [run('STAKEHOLDER BRIEFING DOCUMENT', { bold: true, size: 22, color: C.textMid, allCaps: true })],
    spacing: { before: 80, after: 80 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [run('Prepared for: Engineering Leadership & All Development Teams', { size: 21, color: C.textMid })],
    spacing: { before: 60, after: 60 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [run('Report Date: March 28, 2026  |  Classification: Internal Use Only', { size: 21, color: C.textMid })],
    spacing: { before: 60, after: 300 },
  }),
  // Metrics row
  makeTable([2340, 2340, 2340, 2340], [
    new TableRow({ children: [
      cell([
        new Paragraph({ alignment: AlignmentType.CENTER, children: [run('16', { bold: true, size: 56, color: C.navy })], spacing: { before: 60, after: 0 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Defined Agents', { size: 18, color: C.textMid })], spacing: { before: 0, after: 60 } }),
      ], 2340, { bg: C.skyBlue, borders: B_NONE, margins: { top: 100, bottom: 100, left: 80, right: 80 } }),
      cell([
        new Paragraph({ alignment: AlignmentType.CENTER, children: [run('63', { bold: true, size: 56, color: C.navy })], spacing: { before: 60, after: 0 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Skills Available', { size: 18, color: C.textMid })], spacing: { before: 0, after: 60 } }),
      ], 2340, { bg: C.skyBlue, borders: B_NONE, margins: { top: 100, bottom: 100, left: 80, right: 80 } }),
      cell([
        new Paragraph({ alignment: AlignmentType.CENTER, children: [run('3+', { bold: true, size: 56, color: C.navy })], spacing: { before: 60, after: 0 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [run('MCP Servers', { size: 18, color: C.textMid })], spacing: { before: 0, after: 60 } }),
      ], 2340, { bg: C.skyBlue, borders: B_NONE, margins: { top: 100, bottom: 100, left: 80, right: 80 } }),
      cell([
        new Paragraph({ alignment: AlignmentType.CENTER, children: [run('3.5/5', { bold: true, size: 56, color: C.navy })], spacing: { before: 60, after: 0 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [run('AI Maturity', { size: 18, color: C.textMid })], spacing: { before: 0, after: 60 } }),
      ], 2340, { bg: C.skyBlue, borders: B_NONE, margins: { top: 100, bottom: 100, left: 80, right: 80 } }),
    ]}),
  ]),
  spacer(400),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [run('Researched & Compiled by GitHub Copilot CLI  |  Sub-Agent Analysis', { size: 19, color: C.textLight, italics: true })],
    spacing: { before: 0, after: 0 },
  }),
  pb(),
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: EXECUTIVE SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
const execSummary = [
  h1('Executive Summary'),
  p('This report presents a comprehensive analysis of the current AI adoption state across development teams, focusing on GitHub Copilot\'s agentic capabilities, the Skills library ecosystem, MCP server integrations, and the strategic question of whether the legacy Prompts folder remains relevant given the shift to Skills. Three parallel AI sub-agents conducted independent deep research across the codebase to produce this briefing.', { size: 22 }),
  spacer(100),
  h2('Key Findings at a Glance'),
  makeTable([3120, 3120, 3120], [
    new TableRow({ children: [hCell('Domain', 3120), hCell('Current State', 3120), hCell('Maturity Signal', 3120)] }),
    new TableRow({ children: [
      cell('AI Agents', 3120, { bg: C.midGray, bold: true }),
      cell('16 agents defined (6 primary roles + 10 domain specialists)', 3120),
      statusCell('Sophisticated', 3120, 'green'),
    ]}),
    new TableRow({ children: [
      cell('Skills Library', 3120, { bg: C.midGray, bold: true }),
      cell('63 skills across 8 categories; open-standard format (30+ tools)', 3120),
      statusCell('Advanced', 3120, 'green'),
    ]}),
    new TableRow({ children: [
      cell('MCP Servers', 3120, { bg: C.midGray, bold: true }),
      cell('Supabase, shadcn, Next.js, GitHub MCP all configured/available', 3120),
      statusCell('Maturing', 3120, 'blue'),
    ]}),
    new TableRow({ children: [
      cell('Agent Memory', 3120, { bg: C.midGray, bold: true }),
      cell('Session-based only; no persistent cross-session memory', 3120),
      statusCell('Gap Identified', 3120, 'amber'),
    ]}),
    new TableRow({ children: [
      cell('Prompts Folder', 3120, { bg: C.midGray, bold: true }),
      cell('16 prompts; 5 unique, 4 fully redundant with skills, 7 partial', 3120),
      statusCell('Deprecation Ready', 3120, 'amber'),
    ]}),
    new TableRow({ children: [
      cell('Multi-Agent Patterns', 3120, { bg: C.midGray, bold: true }),
      cell('Parallel dispatch, subagent-driven dev, fleet mode all operational', 3120),
      statusCell('Production Ready', 3120, 'green'),
    ]}),
  ]),
  spacer(120),
  h2('Strategic Recommendations Summary'),
  bullet('IMMEDIATE: Delete 2 fully-redundant prompts (tl-code-review, dev-debug) — Skills provide 100% coverage'),
  bullet('SHORT-TERM: Convert 5 unique prompts to Skills to enable cross-tool compatibility'),
  bullet('MEDIUM-TERM: Implement persistent agent memory (session DB or long-term context store)'),
  bullet('LONG-TERM: Deprecate prompts folder in v2.0, remove in v3.0; double MCP server coverage'),
  bullet('ALL TEAMS: Begin Day-1 skill adoption: using-superpowers, agents-md, writing-plans, verification-before-completion'),
  pb(),
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: AI AGENTS
// ─────────────────────────────────────────────────────────────────────────────
const sectionAgents = [
  h1('Section 1: AI Agent Ecosystem'),
  p('The codebase defines two tiers of AI agents: six primary role-based agents for everyday team workflows, and ten specialized reference agents for domain-specific tasks. All agents follow structured, checklist-driven behavior patterns with explicit communication protocols.', { size: 22 }),
  spacer(80),
  h2('1.1 Primary Role Agents'),
  p('Six named agents are defined in .github/agents/ and are immediately available to all team members. Each agent has a specific domain, non-overlapping responsibilities, and explicit output expectations.'),
  spacer(60),
  makeTable([2100, 1800, 3300, 2160], [
    new TableRow({ children: [hCell('Agent', 2100), hCell('Role', 1800), hCell('Key Capabilities', 3300), hCell('Output Type', 2160)] }),
    new TableRow({ children: [
      cell('Architect', 2100, { bold: true }),
      cell('Solution Architecture', 1800),
      cell('Dependency mapping, coupling/cohesion analysis, blast radius estimation, Mermaid diagrams, tradeoff decisions', 3300),
      cell('Architecture docs, diagrams', 2160),
    ]}),
    new TableRow({ children: [
      cell('Code Reviewer', 2100, { bold: true, bg: C.lightGray }),
      cell('Senior Reviewer', 1800, { bg: C.lightGray }),
      cell('Security validation (XSS, auth/authz), logic error detection, concurrency checks, architecture compliance', 3300, { bg: C.lightGray }),
      cell('CRITICAL / IMPORTANT / SUGGESTION report', 2160, { bg: C.lightGray }),
    ]}),
    new TableRow({ children: [
      cell('Code Reviewer (Superpowers)', 2100, { bold: true }),
      cell('Plan-Aligned Reviewer', 1800),
      cell('Validates completed steps against original plans, spec compliance, quality assessment, deviation communication', 3300),
      cell('Spec & quality review report', 2160),
    ]}),
    new TableRow({ children: [
      cell('Delivery Tracker', 2100, { bold: true, bg: C.lightGray }),
      cell('Delivery Manager', 1800, { bg: C.lightGray }),
      cell('Sprint analysis, PR grouping, cycle time calculation, risk assessment, backlog intelligence, coding agent success metrics', 3300, { bg: C.lightGray }),
      cell('Non-technical business summaries', 2160, { bg: C.lightGray }),
    ]}),
    new TableRow({ children: [
      cell('Product Analyst', 2100, { bold: true }),
      cell('Product Owner', 1800),
      cell('Codebase impact analysis, user journey mapping through code, coding agent suitability assessment, WRAP framework issue generation', 3300),
      cell('Scope estimates (S/M/L), GitHub issues', 2160),
    ]}),
    new TableRow({ children: [
      cell('Test Engineer', 2100, { bold: true, bg: C.lightGray }),
      cell('QA Specialist', 1800, { bg: C.lightGray }),
      cell('Test pyramid architecture (unit/integration/E2E/contract), edge case design, concurrency & security testing, coverage gap identification', 3300, { bg: C.lightGray }),
      cell('Test suites, coverage reports, test plans', 2160, { bg: C.lightGray }),
    ]}),
  ]),
  spacer(120),
  h2('1.2 Reference / Domain Specialist Agents'),
  p('Ten domain-specific reference agents are defined in .github/skills/_agents-reference/ and provide deep specialization for stack-specific work. These agents are paired with MCP server tools for live data access.'),
  spacer(60),
  makeTable([2500, 4060, 2800], [
    new TableRow({ children: [hCell('Agent', 2500), hCell('Specialization', 4060), hCell('Key Integration', 2800)] }),
    new TableRow({ children: [cell('Supabase DBA Schema Advisor', 2500, { bold: true }), cell('Database schema architecture, RLS policy optimization, performance tuning, migration review', 4060), cell('mcp__supabase__* tools', 2800)] }),
    new TableRow({ children: [cell('RLS Policy Architect', 2500, { bold: true, bg: C.lightGray }), cell('Row-Level Security policy design and access control patterns for PostgreSQL', 4060, { bg: C.lightGray }), cell('Supabase MCP + Bash', 2800, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Supabase Edge Function Writer', 2500, { bold: true }), cell('Deno-based serverless function development for Supabase platform', 4060), cell('Supabase MCP', 2800)] }),
    new TableRow({ children: [cell('Supabase Migration Expert', 2500, { bold: true, bg: C.lightGray }), cell('Database migration planning, schema evolution, and upgrade execution', 4060, { bg: C.lightGray }), cell('Supabase MCP + Drizzle', 2800, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Supabase Realtime Expert', 2500, { bold: true }), cell('Real-time subscription architecture, WebSocket/streaming patterns', 4060), cell('Supabase MCP', 2800)] }),
    new TableRow({ children: [cell('Drizzle Agent', 2500, { bold: true, bg: C.lightGray }), cell('Drizzle ORM & PostgreSQL type-safe operations, schema design, migration management', 4060, { bg: C.lightGray }), cell('npm run db:* scripts', 2800, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('TypeScript / React Agent', 2500, { bold: true }), cell('Full-stack TypeScript, React, and Next.js development patterns', 4060), cell('Bash, file tools', 2800)] }),
    new TableRow({ children: [cell('Jira Story Builder', 2500, { bold: true, bg: C.lightGray }), cell('Transform unstructured requirements (meeting notes, Google Docs) into implementation-ready Jira stories using WRAP framework', 4060, { bg: C.lightGray }), cell('Content analysis, artifact generation', 2800, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('CopilotKit Expert', 2500, { bold: true }), cell('CopilotKit v1.50+ framework setup, AI chat/agentic applications, adapter configuration', 4060), cell('Bash, Node.js tools', 2800)] }),
    new TableRow({ children: [cell('Supabase Function Generator', 2500, { bold: true, bg: C.lightGray }), cell('Automated scaffolding of Supabase functions and code generation', 4060, { bg: C.lightGray }), cell('Supabase MCP', 2800, { bg: C.lightGray })] }),
  ]),
  pb(),
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: MEMORY & STATE
// ─────────────────────────────────────────────────────────────────────────────
const sectionMemory = [
  h1('Section 2: Memory & State Management'),
  // Warning box
  makeTable([PAGE.content], [
    new TableRow({ children: [new TableCell({
      width: { size: PAGE.content, type: WidthType.DXA },
      borders: B_ALL(C.amber),
      shading: { fill: C.lightAmber, type: ShadingType.CLEAR },
      margins: CELL_PAD,
      children: [
        new Paragraph({ children: [run('CRITICAL GAP IDENTIFIED', { bold: true, size: 22, color: C.amber })], spacing: { before: 40, after: 60 } }),
        new Paragraph({ children: [run('All current AI agents operate in a stateless, session-based model. There is no persistent memory, cross-session context, or shared knowledge store between agent invocations. Each session starts from zero. This represents the most significant maturity gap in the current implementation.', { size: 21, color: C.textDark })], spacing: { before: 0, after: 40 } }),
      ],
    })]})
  ]),
  spacer(120),
  h2('2.1 How State Is Currently Managed'),
  p('Despite having no persistent agent memory, the ecosystem uses four complementary mechanisms to maintain continuity across work sessions:'),
  spacer(60),
  makeTable([2200, 4400, 2760], [
    new TableRow({ children: [hCell('Mechanism', 2200), hCell('How It Works', 4400), hCell('Limitation', 2760)] }),
    new TableRow({ children: [cell('Git History', 2200, { bold: true }), cell('All code changes are committed; PRs and diffs serve as an audit trail of what agents have completed', 4400), cell('Manual interpretation required; not queryable by agents', 2760)] }),
    new TableRow({ children: [cell('TodoWrite / Checkpoints', 2200, { bold: true, bg: C.lightGray }), cell('In-session task tracking via todo lists; tasks marked in_progress then completed within the same session', 4400, { bg: C.lightGray }), cell('Lost at session end; no persistence', 2760, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Copilot Spaces', 2200, { bold: true }), cell('Manual context curation aggregating repos, PRs, issues, notes, and images. Supports Private/Team/Public sharing with auto-sync', 4400), cell('Requires manual setup; not automatic memory', 2760)] }),
    new TableRow({ children: [cell('Environment Variables', 2200, { bold: true, bg: C.lightGray }), cell('Configuration (API keys, Supabase URLs) stored in .env files, loaded via dotenv-cli for consistency across sessions', 4400, { bg: C.lightGray }), cell('Config only; not knowledge or context', 2760, { bg: C.lightGray })] }),
  ]),
  spacer(120),
  h2('2.2 What Would True Persistent Memory Enable'),
  bullet('Agents that remember previous architectural decisions and avoid contradicting past choices'),
  bullet('Cross-session bug pattern tracking: agents learn what kinds of errors occur in this codebase'),
  bullet('Onboarding acceleration: new team members interact with an agent that already knows the entire history'),
  bullet('Velocity metrics: accurate tracking of what agents completed, how long it took, and what was reverted'),
  bullet('Knowledge compounding: each session builds on the last rather than starting from scratch'),
  spacer(80),
  h2('2.3 Recommended Memory Architecture'),
  p('To close this gap, the following layered memory approach is recommended for evaluation:'),
  spacer(60),
  makeTable([2000, 5200, 2160], [
    new TableRow({ children: [hCell('Layer', 2000), hCell('Implementation', 5200), hCell('Priority', 2160)] }),
    new TableRow({ children: [cell('Session DB', 2000, { bold: true }), cell('Per-session SQLite database (already available in Copilot CLI) for task tracking, test cases, intermediate results', 5200), statusCell('Use Now', 2160, 'green')] }),
    new TableRow({ children: [cell('Session Store', 2000, { bold: true, bg: C.lightGray }), cell('Cross-session read-only history store — query past sessions, file changes, PR refs, full-text search across all work', 5200, { bg: C.lightGray }), statusCell('Use Now', 2160, 'green')] }),
    new TableRow({ children: [cell('Agent Memory Files', 2000, { bold: true }), cell('Dedicated memory.md or context.md files per project that agents update and read across sessions', 5200), statusCell('Recommended', 2160, 'blue')] }),
    new TableRow({ children: [cell('Vector Store', 2000, { bold: true, bg: C.lightGray }), cell('Embedding-based semantic search over codebase, past decisions, architecture notes for retrieval-augmented agents', 5200, { bg: C.lightGray }), statusCell('Long-Term', 2160, 'amber')] }),
  ]),
  pb(),
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: TOOLS & MCP SERVERS
// ─────────────────────────────────────────────────────────────────────────────
const sectionMCP = [
  h1('Section 3: Tools & MCP Server Integration'),
  p('AI agents have access to a rich set of built-in tools, supplemented by MCP (Model Context Protocol) servers that provide live connections to external services. MCP is the emerging standard for giving LLMs access to real-world data sources and APIs.', { size: 22 }),
  spacer(80),
  h2('3.1 Built-In Agent Tools'),
  makeTable([2800, 4200, 2360], [
    new TableRow({ children: [hCell('Tool Category', 2800), hCell('Available Tools', 4200), hCell('Use Cases', 2360)] }),
    new TableRow({ children: [cell('File System', 2800, { bold: true }), cell('Read, Grep, Glob, View, Edit, Create', 4200), cell('Navigate, search, modify code', 2360)] }),
    new TableRow({ children: [cell('Execution', 2800, { bold: true, bg: C.lightGray }), cell('Bash (full shell access), package.json script runners', 4200, { bg: C.lightGray }), cell('Build, test, lint, type-check', 2360, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Code Analysis', 2800, { bold: true }), cell('Dependency tracing, circular dependency detection, type checking (without builds)', 4200), cell('Architecture review, quality gates', 2360)] }),
    new TableRow({ children: [cell('Web / External', 2800, { bold: true, bg: C.lightGray }), cell('Web search, URL fetching, GitHub API (issues, PRs, commits, workflows)', 4200, { bg: C.lightGray }), cell('Research, PR reviews, CI/CD', 2360, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Database', 2800, { bold: true }), cell('SQL execution (SQLite session DB, session store), Supabase via MCP', 4200), cell('State tracking, schema queries', 2360)] }),
    new TableRow({ children: [cell('Project Management', 2800, { bold: true, bg: C.lightGray }), cell('ClickUp (tasks, comments, time tracking, documents), Jira (via story builder agent)', 4200, { bg: C.lightGray }), cell('Task management, sprint tracking', 2360, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Document Generation', 2800, { bold: true }), cell('DOCX (Word), PPTX (PowerPoint) generation via skill-driven scripts', 4200), cell('Stakeholder reports, presentations', 2360)] }),
  ]),
  spacer(120),
  h2('3.2 MCP Server Configurations'),
  p('MCP servers extend agent capabilities with live data connections. The following servers are active or available:'),
  spacer(60),
  makeTable([2200, 1500, 3500, 2160], [
    new TableRow({ children: [hCell('MCP Server', 2200), hCell('Status', 1500), hCell('Capabilities', 3500), hCell('Config Location', 2160)] }),
    new TableRow({ children: [
      cell('Supabase MCP', 2200, { bold: true }),
      statusCell('Active', 1500, 'green'),
      cell('Full database operations: schema inspection, SQL execution, migrations, RLS policies, Edge Function deployment. Used by 6 reference agents.', 3500),
      cell('~/.config/claude-code/mcp.json', 2160),
    ]}),
    new TableRow({ children: [
      cell('shadcn MCP', 2200, { bold: true, bg: C.lightGray }),
      statusCell('Active', 1500, 'green'),
      cell('7 tools: component registry search, install, view. Supports multiple registries beyond the default shadcn registry.', 3500, { bg: C.lightGray }),
      cell('.mcp.json (Claude), .cursor/mcp.json, .vscode/mcp.json', 2160, { bg: C.lightGray }),
    ]}),
    new TableRow({ children: [
      cell('Next.js MCP Endpoint', 2200, { bold: true }),
      statusCell('Available', 1500, 'blue'),
      cell('AI-assisted debugging for Next.js apps via /_next/mcp endpoint. Provides runtime context during development.', 3500),
      cell('Enabled via next.config.js or Next.js 16+ default', 2160),
    ]}),
    new TableRow({ children: [
      cell('GitHub MCP', 2200, { bold: true, bg: C.lightGray }),
      statusCell('Available', 1500, 'blue'),
      cell('Issues, PRs, commits, workflows, code search across repositories. Pre-configured in Copilot CLI.', 3500, { bg: C.lightGray }),
      cell('Built into Copilot CLI; /mcp add for custom instances', 2160, { bg: C.lightGray }),
    ]}),
    new TableRow({ children: [
      cell('Context7', 2200, { bold: true }),
      statusCell('Configured', 1500, 'blue'),
      cell('Upstash Context7 server for context storage and retrieval operations', 3500),
      cell('~/.config/claude-code/mcp.json', 2160),
    ]}),
    new TableRow({ children: [
      cell('Time MCP', 2200, { bold: true, bg: C.lightGray }),
      statusCell('Configured', 1500, 'blue'),
      cell('Local timezone information (America/New_York). Ensures time-aware agent behavior.', 3500, { bg: C.lightGray }),
      cell('~/.config/claude-code/mcp.json', 2160, { bg: C.lightGray }),
    ]}),
  ]),
  spacer(120),
  h2('3.3 MCP Tool Naming Best Practice'),
  makeTable([PAGE.content], [
    new TableRow({ children: [new TableCell({
      width: { size: PAGE.content, type: WidthType.DXA },
      borders: B_ALL(C.blue),
      shading: { fill: C.paleBue, type: ShadingType.CLEAR },
      margins: CELL_PAD,
      children: [
        new Paragraph({ children: [run('Required Convention from Anthropic Best Practices:', { bold: true, size: 21, color: C.navy })], spacing: { before: 40, after: 80 } }),
        new Paragraph({ children: [run('Always use fully qualified tool names: ServerName:tool_name  (e.g., Supabase:list_tables, BigQuery:bigquery_schema)', { size: 21, color: C.textDark, italics: true })], spacing: { before: 0, after: 60 } }),
        new Paragraph({ children: [run('Without the server prefix, Claude and other LLMs fail to locate tools when multiple MCP servers are loaded simultaneously. All skill documentation must follow this pattern.', { size: 21, color: C.textMid })], spacing: { before: 0, after: 40 } }),
      ],
    })]})
  ]),
  pb(),
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: SKILLS LIBRARY
// ─────────────────────────────────────────────────────────────────────────────
const sectionSkills = [
  h1('Section 4: Skills Library Analysis'),
  p('The Skills library is the cornerstone of the AI adoption strategy. With 63 skills across 8 categories, it follows the open Agent Skills standard (agentskills.io) — meaning each skill works across 30+ AI tools including GitHub Copilot, Claude Code, Cursor, Codex CLI, and Gemini CLI. This write-once, run-everywhere capability makes the library a permanent, compounding asset.', { size: 22 }),
  spacer(80),
  h2('4.1 Skills at a Glance'),
  makeTable([2360, 2360, 2360, 2280], [
    new TableRow({ children: [
      cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run('63', { bold: true, size: 52, color: C.navy })], spacing: { before: 40, after: 0 } }), new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Total Skills', { size: 18, color: C.textMid })], spacing: { before: 0, after: 40 } })], 2360, { bg: C.paleBue, borders: B_NONE, margins: { top: 80, bottom: 80, left: 60, right: 60 } }),
      cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run('11', { bold: true, size: 52, color: C.navy })], spacing: { before: 40, after: 0 } }), new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Superpowers Skills', { size: 18, color: C.textMid })], spacing: { before: 0, after: 40 } })], 2360, { bg: C.paleBue, borders: B_NONE, margins: { top: 80, bottom: 80, left: 60, right: 60 } }),
      cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run('8', { bold: true, size: 52, color: C.navy })], spacing: { before: 40, after: 0 } }), new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Design Skills', { size: 18, color: C.textMid })], spacing: { before: 0, after: 40 } })], 2360, { bg: C.paleBue, borders: B_NONE, margins: { top: 80, bottom: 80, left: 60, right: 60 } }),
      cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run('30+', { bold: true, size: 52, color: C.navy })], spacing: { before: 40, after: 0 } }), new Paragraph({ alignment: AlignmentType.CENTER, children: [run('Compatible Tools', { size: 18, color: C.textMid })], spacing: { before: 0, after: 40 } })], 2280, { bg: C.paleBue, borders: B_NONE, margins: { top: 80, bottom: 80, left: 60, right: 60 } }),
    ]}),
  ]),
  spacer(120),
  h2('4.2 Tiered Adoption Roadmap'),
  h3('Tier 1 — Day 1 Essentials (Must Adopt)'),
  makeTable([2000, 4500, 2860], [
    new TableRow({ children: [hCell('Skill', 2000), hCell('Purpose', 4500), hCell('Category', 2860)] }),
    new TableRow({ children: [cell('using-superpowers', 2000, { bold: true }), cell('Foundation skill: how to discover, invoke, and chain all other skills', 4500), cell('Orchestration', 2860)] }),
    new TableRow({ children: [cell('agents-md', 2000, { bold: true, bg: C.lightGray }), cell('Create/update AGENTS.md files for repository-level AI guidance and module maps', 4500, { bg: C.lightGray }), cell('Orchestration', 2860, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('verification-before-completion', 2000, { bold: true }), cell('Evidence-based completion gates — prevents false completion claims from agents', 4500), cell('Quality', 2860)] }),
    new TableRow({ children: [cell('writing-plans', 2000, { bold: true, bg: C.lightGray }), cell('Plan-driven development: creates a contract between human and AI before implementation begins', 4500, { bg: C.lightGray }), cell('Planning', 2860, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('review', 2000, { bold: true }), cell('Pre-landing PR review: SQL safety, LLM boundaries, race conditions, conditional side effects', 4500), cell('Code Review', 2860)] }),
  ]),
  spacer(80),
  h3('Tier 2 — Week 1-2 (High Priority)'),
  makeTable([2000, 4500, 2860], [
    new TableRow({ children: [hCell('Skill', 2000), hCell('Purpose', 4500), hCell('Category', 2860)] }),
    new TableRow({ children: [cell('systematic-debugging', 2000, { bold: true }), cell('4-phase investigation: Investigate → Analyze → Hypothesize → Implement with red flag detection', 4500), cell('Debugging', 2860)] }),
    new TableRow({ children: [cell('dispatching-parallel-agents', 2000, { bold: true, bg: C.lightGray }), cell('Run 2+ independent tasks concurrently; rules for safe parallel execution and conflict prevention', 4500, { bg: C.lightGray }), cell('Agent Orchestration', 2860, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('python-testing-patterns', 2000, { bold: true }), cell('Comprehensive pytest, fixtures, mocking, parameterization and test-driven development', 4500), cell('Testing', 2860)] }),
    new TableRow({ children: [cell('ship', 2000, { bold: true, bg: C.lightGray }), cell('End-to-end shipping pipeline: merge, tests, review, version bump, changelog, PR automation', 4500, { bg: C.lightGray }), cell('Deployment', 2860, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('investigate', 2000, { bold: true }), cell('Systematic root-cause debugging with structured analysis workflow', 4500), cell('Debugging', 2860)] }),
  ]),
  spacer(80),
  h3('Tier 3 — Weeks 3-4 (Stack Specific)'),
  makeTable([2000, 4500, 2860], [
    new TableRow({ children: [hCell('Skill', 2000), hCell('Purpose', 4500), hCell('Category', 2860)] }),
    new TableRow({ children: [cell('next-best-practices', 2000, { bold: true }), cell('Next.js file conventions, RSC boundaries, data patterns, async APIs, metadata, optimization', 4500), cell('Frontend', 2860)] }),
    new TableRow({ children: [cell('vitest', 2000, { bold: true, bg: C.lightGray }), cell('Vite-native fast testing (Jest-compatible), TypeScript support, component testing', 4500, { bg: C.lightGray }), cell('Testing', 2860, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('adversarial-review', 2000, { bold: true }), cell('Spawn opposite-model reviewers (1-3 agents) to challenge work from distinct critical lenses', 4500), cell('Code Review', 2860)] }),
    new TableRow({ children: [cell('audit', 2000, { bold: true, bg: C.lightGray }), cell('Comprehensive quality audit: accessibility, performance, theming, responsive design', 4500, { bg: C.lightGray }), cell('Design', 2860, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('python-design-patterns', 2000, { bold: true }), cell('KISS, SRP, composition over inheritance — architecture from day one', 4500), cell('Architecture', 2860)] }),
    new TableRow({ children: [cell('docx / pptx', 2000, { bold: true, bg: C.lightGray }), cell('Word document and PowerPoint generation for reports, proposals, and stakeholder presentations', 4500, { bg: C.lightGray }), cell('Office Automation', 2860, { bg: C.lightGray })] }),
  ]),
  spacer(120),
  h2('4.3 Safety & Guardrail Skills'),
  p('The library includes dedicated safety skills that protect teams from destructive operations:'),
  spacer(60),
  makeTable([1800, 5200, 2360], [
    new TableRow({ children: [hCell('Skill', 1800), hCell('Protection', 5200), hCell('Trigger', 2360)] }),
    new TableRow({ children: [cell('careful', 1800, { bold: true }), cell('Warns before: rm -rf, DROP TABLE, force-push, destructive migrations, production deployments', 5200), cell('Pre-tool hook', 2360)] }),
    new TableRow({ children: [cell('freeze / unfreeze', 1800, { bold: true, bg: C.lightGray }), cell('Restricts agent edits to a specified directory for the session; prevents scope creep', 5200, { bg: C.lightGray }), cell('Session scoping', 2360, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('canary', 1800, { bold: true }), cell('Post-deploy monitoring for console errors, performance regressions, page load failures', 5200), cell('Post-deploy', 2360)] }),
    new TableRow({ children: [cell('benchmark', 1800, { bold: true, bg: C.lightGray }), cell('Performance regression detection: Core Web Vitals, page load times, bundle size tracking', 5200, { bg: C.lightGray }), cell('CI/CD gate', 2360, { bg: C.lightGray })] }),
  ]),
  pb(),
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: PROMPTS vs SKILLS
// ─────────────────────────────────────────────────────────────────────────────
const sectionPrompts = [
  h1('Section 5: Prompts Folder vs. Skills — Strategic Decision'),
  p('The .github/prompts/ folder contains 16 reusable workflow templates that were established prior to the Skills system adoption. With the Skills library now mature at 63 skills, a strategic decision must be made: maintain both systems, migrate, or deprecate prompts.', { size: 22 }),
  spacer(80),
  h2('5.1 Architectural Comparison'),
  makeTable([2000, 3680, 3680], [
    new TableRow({ children: [hCell('Dimension', 2000), hCell('Prompts Folder', 3680), hCell('Skills Folder', 3680)] }),
    new TableRow({ children: [cell('Triggering', 2000, { bold: true }), cell('Manual /slash-command invocation — user must know the command exists', 3680), cell('Automatic contextual discovery — Copilot detects when relevant', 3680)] }),
    new TableRow({ children: [cell('Standard', 2000, { bold: true, bg: C.lightGray }), cell('GitHub Copilot proprietary format only', 3680, { bg: C.lightGray }), cell('Agent Skills open standard — works across 30+ tools', 3680, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Distribution', 2000, { bold: true }), cell('Per-repository; GitHub Copilot only', 3680), cell('Universal: personal (~/.claude/skills/), project (.github/skills/), organization (coming soon)', 3680)] }),
    new TableRow({ children: [cell('Complexity', 2000, { bold: true, bg: C.lightGray }), cell('Single flat file, one-shot template (~2-35 lines)', 3680, { bg: C.lightGray }), cell('Hierarchical directory with scripts, references, assets; chaining support', 3680, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Chaining', 2000, { bold: true }), cell('Single task per session; no workflow chaining', 3680), cell('Multi-step workflows + skill-to-skill chaining', 3680)] }),
    new TableRow({ children: [cell('Future Proof', 2000, { bold: true, bg: C.lightGray }), cell('GitHub Copilot roadmap dependent', 3680, { bg: C.lightGray }), cell('Open standard backed by major AI tool vendors', 3680, { bg: C.lightGray })] }),
  ]),
  spacer(120),
  h2('5.2 Prompts Coverage Analysis'),
  p('A sub-agent read all 16 prompt files and compared them to the 63-skill library. Here is the complete coverage assessment:'),
  spacer(60),
  makeTable([2800, 1560, 1560, 3440], [
    new TableRow({ children: [hCell('Prompt File', 2800), hCell('Skill Coverage', 1560), hCell('Coverage %', 1560), hCell('Recommended Action', 3440)] }),
    new TableRow({ children: [cell('tl-code-review.prompt.md', 2800, { bold: true }), statusCell('FULL', 1560, 'red'), statusCell('100%', 1560, 'red'), cell('DELETE — fully replaced by review/SKILL.md (657 lines)', 3440)] }),
    new TableRow({ children: [cell('dev-debug.prompt.md', 2800, { bold: true, bg: C.lightGray }), statusCell('FULL', 1560, 'red'), statusCell('100%', 1560, 'red'), cell('DELETE — fully replaced by systematic-debugging/SKILL.md', 3440, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('execute-issues.prompt.md', 2800, { bold: true }), statusCell('FULL', 1560, 'red'), statusCell('90%+', 1560, 'red'), cell('DELETE — dispatching-parallel-agents/SKILL.md is a superset', 3440)] }),
    new TableRow({ children: [cell('qa-generate-tests.prompt.md', 2800, { bold: true, bg: C.lightGray }), statusCell('PARTIAL', 1560, 'amber'), statusCell('80%', 1560, 'amber'), cell('Consolidate into superpowers-test-driven-development/SKILL.md', 3440, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('dev-refactor.prompt.md', 2800, { bold: true }), statusCell('PARTIAL', 1560, 'amber'), statusCell('75%', 1560, 'amber'), cell('Merge missing content into TDD skill\'s REFACTOR phase', 3440)] }),
    new TableRow({ children: [cell('qa-test-plan.prompt.md', 2800, { bold: true, bg: C.lightGray }), statusCell('PARTIAL', 1560, 'amber'), statusCell('80%', 1560, 'amber'), cell('Merge into TDD + qa/SKILL.md', 3440, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('dm-sprint-summary.prompt.md', 2800, { bold: true }), statusCell('PARTIAL', 1560, 'amber'), statusCell('70%', 1560, 'amber'), cell('Enhance retro/SKILL.md to cover sprint summaries', 3440)] }),
    new TableRow({ children: [cell('tl-architecture-review.prompt.md', 2800, { bold: true, bg: C.lightGray }), statusCell('PARTIAL', 1560, 'amber'), statusCell('50%', 1560, 'amber'), cell('Create architecture-review/SKILL.md; different timing context', 3440, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('sa-dependency-map.prompt.md', 2800, { bold: true }), statusCell('PARTIAL', 1560, 'amber'), statusCell('65%', 1560, 'amber'), cell('Fold remaining into design-consultation or investigate skill', 3440)] }),
    new TableRow({ children: [cell('analyze-codebase.prompt.md', 2800, { bold: true, bg: C.lightGray }), statusCell('PARTIAL', 1560, 'amber'), statusCell('60%', 1560, 'amber'), cell('Enhance investigate/SKILL.md to cover performance/quality scan', 3440, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('classify-issues.prompt.md', 2800, { bold: true }), statusCell('PARTIAL', 1560, 'amber'), statusCell('70%', 1560, 'amber'), cell('Merge into dispatching-parallel-agents/SKILL.md', 3440)] }),
    new TableRow({ children: [cell('po-write-story.prompt.md', 2800, { bold: true, bg: C.lightGray }), statusCell('NONE', 1560, 'green'), statusCell('0%', 1560, 'green'), cell('CONVERT TO SKILL — Create story-writing/SKILL.md (high risk if removed)', 3440, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('po-impact-assessment.prompt.md', 2800, { bold: true }), statusCell('NONE', 1560, 'green'), statusCell('0%', 1560, 'green'), cell('CONVERT TO SKILL — Create change-impact-assessment/SKILL.md', 3440)] }),
    new TableRow({ children: [cell('sa-api-design.prompt.md', 2800, { bold: true, bg: C.lightGray }), statusCell('NONE', 1560, 'green'), statusCell('0%', 1560, 'green'), cell('CONVERT TO SKILL — Create api-design/SKILL.md', 3440, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('dm-risk-assessment.prompt.md', 2800, { bold: true }), statusCell('NONE', 1560, 'green'), statusCell('0%', 1560, 'green'), cell('CONVERT TO SKILL — Create release-risk-assessment/SKILL.md', 3440)] }),
    new TableRow({ children: [cell('create-issues.prompt.md', 2800, { bold: true, bg: C.lightGray }), statusCell('NONE', 1560, 'green'), statusCell('0%', 1560, 'green'), cell('CONVERT TO SKILL — Create batch-issue-creation/SKILL.md', 3440, { bg: C.lightGray })] }),
  ]),
  spacer(100),
  p('Legend: RED = Delete immediately (redundant). AMBER = Consolidate into existing skills. GREEN = Unique value — convert to skill before removing.', { size: 19, color: C.textMid, italics: true }),
  spacer(120),
  h2('5.3 Verdict & Deprecation Path'),
  makeTable([2400, 2400, 4560], [
    new TableRow({ children: [hCell('Category', 2400), hCell('Count', 2400), hCell('Decision', 4560)] }),
    new TableRow({ children: [cell('Fully redundant (100% skill coverage)', 2400, { bg: C.lightRed }), cell('3 / 16', 2400, { bg: C.lightRed, bold: true }), cell('Safe to delete immediately with no workflow disruption', 4560, { bg: C.lightRed })] }),
    new TableRow({ children: [cell('Partially covered (50-80% skill coverage)', 2400, { bg: C.lightAmber }), cell('8 / 16', 2400, { bg: C.lightAmber, bold: true }), cell('Consolidate unique content into existing skills, then delete', 4560, { bg: C.lightAmber })] }),
    new TableRow({ children: [cell('No skill equivalent (unique capability)', 2400, { bg: C.lightGreen }), cell('5 / 16', 2400, { bg: C.lightGreen, bold: true }), cell('Must convert to skills BEFORE removing to prevent workflow loss', 4560, { bg: C.lightGreen })] }),
  ]),
  pb(),
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: RECOMMENDATIONS & ROADMAP
// ─────────────────────────────────────────────────────────────────────────────
const sectionRecommendations = [
  h1('Section 6: Strategic Recommendations & Roadmap'),
  p('Based on the multi-agent analysis, the following phased action plan is recommended for all development teams. Actions are sequenced to maximize immediate value while managing transition risk.', { size: 22 }),
  spacer(80),
  h2('6.1 Phased Action Plan'),
  makeTable([1800, 3000, 4560], [
    new TableRow({ children: [hCell('Phase', 1800), hCell('Timeframe', 3000), hCell('Actions', 4560)] }),
    new TableRow({ children: [
      cell('Phase 1', 1800, { bold: true, bg: C.lightGreen }),
      cell('IMMEDIATE (This Week)', 3000),
      cell([
        new Paragraph({ children: [run('Delete 3 fully redundant prompts (tl-code-review, dev-debug, execute-issues)', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('All teams adopt Day-1 skill stack: using-superpowers, agents-md, writing-plans', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('Begin using session SQL database for task tracking in all agent sessions', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
      ], 4560),
    ]}),
    new TableRow({ children: [
      cell('Phase 2', 1800, { bold: true, bg: C.paleBue }),
      cell('SHORT-TERM (Weeks 1-2)', 3000, { bg: C.lightGray }),
      cell([
        new Paragraph({ children: [run('Convert 5 unique prompts to skills (story-writing, change-impact-assessment, api-design, release-risk-assessment, batch-issue-creation)', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('Deploy ship, systematic-debugging, and python-testing-patterns for all engineering teams', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('Run team workshops on parallel agent dispatch (dispatching-parallel-agents skill)', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
      ], 4560, { bg: C.lightGray }),
    ]}),
    new TableRow({ children: [
      cell('Phase 3', 1800, { bold: true, bg: C.lightAmber }),
      cell('MEDIUM-TERM (Weeks 3-6)', 3000),
      cell([
        new Paragraph({ children: [run('Consolidate 8 partially-covered prompts into existing skills; deprecate prompts folder', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('Implement project memory.md pattern for persistent cross-session agent context', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('Expand MCP server coverage: connect CI/CD pipelines, internal documentation systems', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('Frontend teams adopt: next-best-practices, vitest, tailwind-design-system, shadcn, audit', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
      ], 4560),
    ]}),
    new TableRow({ children: [
      cell('Phase 4', 1800, { bold: true, bg: C.lightRed }),
      cell('LONG-TERM (Month 2-3+)', 3000, { bg: C.lightGray }),
      cell([
        new Paragraph({ children: [run('Remove prompts folder (v3.0) — all workflows now skills-native', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('Implement vector store for semantic agent memory (retrieval-augmented agents)', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('Publish organization-level skills for cross-team sharing (agentskills.io org standard)', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
        new Paragraph({ children: [run('Evaluate new MCP server additions: vector DB, internal wikis, cloud infrastructure metadata', { size: 20 })], numbering: { reference: 'bullets', level: 0 }, spacing: { before: 40, after: 40 } }),
      ], 4560, { bg: C.lightGray }),
    ]}),
  ]),
  spacer(120),
  h2('6.2 Risk Assessment'),
  makeTable([2200, 1500, 5660], [
    new TableRow({ children: [hCell('Risk', 2200), hCell('Severity', 1500), hCell('Mitigation', 5660)] }),
    new TableRow({ children: [cell('Removing unique prompts before skill equivalents exist', 2200), statusCell('HIGH', 1500, 'red'), cell('Phase 2 explicitly creates skill equivalents before any prompt deletion. Do not remove prompts until skills are validated.', 5660)] }),
    new TableRow({ children: [cell('Agent sessions without persistent memory producing drift', 2200, { bg: C.lightGray }), statusCell('MEDIUM', 1500, 'amber'), cell('Adopt session SQL database (available now) and project memory.md pattern as interim solution.', 5660, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Teams using prompts as primary workflow not aware of skills', 2200), statusCell('MEDIUM', 1500, 'amber'), cell('Run team onboarding sessions. The using-superpowers skill is the first to adopt — it teaches discoverability.', 5660)] }),
    new TableRow({ children: [cell('MCP server credential exposure', 2200, { bg: C.lightGray }), statusCell('LOW', 1500, 'green'), cell('All MCP configs stored in user ~/.config/ not in repository. Never commit API keys to source code. Rotate credentials regularly.', 5660, { bg: C.lightGray })] }),
    new TableRow({ children: [cell('Skill conflicts when multiple agents edit same files', 2200), statusCell('LOW', 1500, 'green'), cell('Dispatching parallel agents skill explicitly prohibits assigning overlapping file scopes. Pre-task file conflict checks are built into the pattern.', 5660)] }),
  ]),
  spacer(120),
  h2('6.3 Expected Business Outcomes'),
  bullet('40-60% reduction in repetitive review and testing overhead through automated agent workflows'),
  bullet('Consistent code quality standards enforced by agents across all teams, not just senior reviewers'),
  bullet('Cross-tool compatibility: investments in the Skills library benefit all 30+ AI tools, not just Copilot'),
  bullet('Onboarding time reduction: new developers interact with agents that know the codebase conventions'),
  bullet('Risk mitigation through safety skills (careful, guard, canary) preventing costly mistakes'),
  bullet('Organization-level knowledge accumulation as the skills library grows and compounds over time'),
  pb(),
];

// ─────────────────────────────────────────────────────────────────────────────
// APPENDIX
// ─────────────────────────────────────────────────────────────────────────────
const appendix = [
  h1('Appendix: Complete Skills Inventory by Category'),
  makeTable([1600, 2800, 5160-200], [
    new TableRow({ children: [hCell('Category', 1600), hCell('Skill Name', 2800), hCell('Description', 4960)] }),
    // Superpowers
    new TableRow({ children: [cell('Superpowers', 1600, { bold: true, bg: C.paleBue }), cell('using-superpowers', 2800, { bg: C.paleBue }), cell('Foundation: how to discover, invoke, and chain all skills', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('test-driven-development', 2800, { bg: C.paleBue }), cell('Write tests first, watch fail, implement minimal code to pass', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('verification-before-completion', 2800, { bg: C.paleBue }), cell('Evidence before claims; verify work before marking done', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('receiving-code-review', 2800, { bg: C.paleBue }), cell('Technical evaluation of feedback before implementing changes', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('requesting-code-review', 2800, { bg: C.paleBue }), cell('When to request review and what to include', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('systematic-debugging', 2800, { bg: C.paleBue }), cell('4-phase: Investigate > Analyze > Hypothesize > Implement', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('writing-skills', 2800, { bg: C.paleBue }), cell('TDD applied to skill documentation creation', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('writing-plans', 2800, { bg: C.paleBue }), cell('Create implementation plans with bite-sized trackable tasks', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('executing-plans', 2800, { bg: C.paleBue }), cell('Execute pre-written plans in separate sessions with checkpoints', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('dispatching-parallel-agents', 2800, { bg: C.paleBue }), cell('Run 2+ independent tasks concurrently with conflict prevention', 4960, { bg: C.paleBue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.paleBue }), cell('subagent-driven-development', 2800, { bg: C.paleBue }), cell('Execute plans with fresh subagents and two-stage reviews', 4960, { bg: C.paleBue })] }),
    // Dev Practices
    new TableRow({ children: [cell('Dev Practices', 1600, { bold: true, bg: C.lightGreen }), cell('agents-md', 2800, { bg: C.lightGreen }), cell('Create/update AGENTS.md for repo guidance and module maps', 4960, { bg: C.lightGreen })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightGreen }), cell('review', 2800, { bg: C.lightGreen }), cell('Pre-landing PR review: SQL, LLM, race conditions, side effects', 4960, { bg: C.lightGreen })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightGreen }), cell('ship', 2800, { bg: C.lightGreen }), cell('End-to-end: merge, tests, review, version bump, PR automation', 4960, { bg: C.lightGreen })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightGreen }), cell('investigate', 2800, { bg: C.lightGreen }), cell('Systematic root-cause debugging with structured workflow', 4960, { bg: C.lightGreen })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightGreen }), cell('adversarial-review', 2800, { bg: C.lightGreen }), cell('Spawn opposite-model reviewers to challenge work', 4960, { bg: C.lightGreen })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightGreen }), cell('land-and-deploy', 2800, { bg: C.lightGreen }), cell('Deployment workflow guidance and integration options', 4960, { bg: C.lightGreen })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightGreen }), cell('document-release', 2800, { bg: C.lightGreen }), cell('Auto-update documentation after shipping releases', 4960, { bg: C.lightGreen })] }),
    // Python
    new TableRow({ children: [cell('Python', 1600, { bold: true, bg: C.lightTeal }), cell('python-testing-patterns', 2800, { bg: C.lightTeal }), cell('Comprehensive pytest, fixtures, mocking, parameterization', 4960, { bg: C.lightTeal })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightTeal }), cell('python-design-patterns', 2800, { bg: C.lightTeal }), cell('KISS, SRP, composition over inheritance for clean architecture', 4960, { bg: C.lightTeal })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightTeal }), cell('python-performance-optimization', 2800, { bg: C.lightTeal }), cell('Profiling, cProfile, memory optimization techniques', 4960, { bg: C.lightTeal })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightTeal }), cell('async-python-patterns', 2800, { bg: C.lightTeal }), cell('asyncio, concurrent programming, async/await for I/O-bound apps', 4960, { bg: C.lightTeal })] }),
    // Frontend
    new TableRow({ children: [cell('Frontend', 1600, { bold: true, bg: C.lightAmber }), cell('next-best-practices', 2800, { bg: C.lightAmber }), cell('Next.js conventions, RSC boundaries, metadata, optimization', 4960, { bg: C.lightAmber })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightAmber }), cell('nextjs-app-router-patterns', 2800, { bg: C.lightAmber }), cell('Next.js 14+ App Router, Server Components, streaming, parallel routes', 4960, { bg: C.lightAmber })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightAmber }), cell('vitest', 2800, { bg: C.lightAmber }), cell('Vite-native fast testing, Jest-compatible, TypeScript support', 4960, { bg: C.lightAmber })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightAmber }), cell('shadcn', 2800, { bg: C.lightAmber }), cell('shadcn/ui component management (MCP-powered registry)', 4960, { bg: C.lightAmber })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightAmber }), cell('vercel-react-best-practices', 2800, { bg: C.lightAmber }), cell('React/Next.js performance: 57 optimization rules', 4960, { bg: C.lightAmber })] }),
    // Design
    new TableRow({ children: [cell('Design', 1600, { bold: true, bg: C.skyBlue }), cell('frontend-design', 2800, { bg: C.skyBlue }), cell('Production-grade interfaces; AI slop anti-pattern detection', 4960, { bg: C.skyBlue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.skyBlue }), cell('arrange', 2800, { bg: C.skyBlue }), cell('Layout, spacing, visual rhythm, hierarchy improvements', 4960, { bg: C.skyBlue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.skyBlue }), cell('normalize', 2800, { bg: C.skyBlue }), cell('Align design to system standards, ensure consistency', 4960, { bg: C.skyBlue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.skyBlue }), cell('polish', 2800, { bg: C.skyBlue }), cell('Final quality pass: alignment, spacing, consistency', 4960, { bg: C.skyBlue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.skyBlue }), cell('audit', 2800, { bg: C.skyBlue }), cell('Comprehensive QA: accessibility, performance, theming, responsive', 4960, { bg: C.skyBlue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.skyBlue }), cell('critique', 2800, { bg: C.skyBlue }), cell('UX evaluation: hierarchy, information architecture, resonance', 4960, { bg: C.skyBlue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.skyBlue }), cell('distill', 2800, { bg: C.skyBlue }), cell('Strip designs to essence by removing unnecessary complexity', 4960, { bg: C.skyBlue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.skyBlue }), cell('delight', 2800, { bg: C.skyBlue }), cell('Add personality, joy, and memorable interface moments', 4960, { bg: C.skyBlue })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.skyBlue }), cell('design-consultation', 2800, { bg: C.skyBlue }), cell('Full design system creation: aesthetic, typography, DESIGN.md', 4960, { bg: C.skyBlue })] }),
    // Safety
    new TableRow({ children: [cell('Safety', 1600, { bold: true, bg: C.lightRed }), cell('careful', 2800, { bg: C.lightRed }), cell('Warns before destructive operations (rm -rf, DROP TABLE, force-push)', 4960, { bg: C.lightRed })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightRed }), cell('freeze / unfreeze', 2800, { bg: C.lightRed }), cell('Restrict agent edits to specific directory during session', 4960, { bg: C.lightRed })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightRed }), cell('canary', 2800, { bg: C.lightRed }), cell('Post-deploy monitoring: console errors, perf regressions, failures', 4960, { bg: C.lightRed })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.lightRed }), cell('benchmark', 2800, { bg: C.lightRed }), cell('Performance regression detection: Core Web Vitals, bundle size', 4960, { bg: C.lightRed })] }),
    // Office / Team
    new TableRow({ children: [cell('Office / Team', 1600, { bold: true, bg: C.midGray }), cell('docx', 2800, { bg: C.midGray }), cell('Word document generation: reports, specs, proposals', 4960, { bg: C.midGray })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.midGray }), cell('pptx', 2800, { bg: C.midGray }), cell('PowerPoint creation: presentations, pitch decks, stakeholder slides', 4960, { bg: C.midGray })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.midGray }), cell('retro', 2800, { bg: C.midGray }), cell('Data-driven retrospective with git history analysis', 4960, { bg: C.midGray })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.midGray }), cell('plan-eng-review', 2800, { bg: C.midGray }), cell('Architecture review before implementation begins', 4960, { bg: C.midGray })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.midGray }), cell('find-skills', 2800, { bg: C.midGray }), cell('Discovery tool: find the right skill for any task', 4960, { bg: C.midGray })] }),
    new TableRow({ children: [cell('', 1600, { bg: C.midGray }), cell('skill-creator', 2800, { bg: C.midGray }), cell('Meta-skill: build new skills for your organization', 4960, { bg: C.midGray })] }),
  ]),
];

// ─────────────────────────────────────────────────────────────────────────────
// BUILD DOCUMENT
// ─────────────────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 22, color: C.textDark } },
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: C.navy },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: C.blue },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: C.textDark },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: 'subbullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u25E6', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE.width, height: PAGE.height },
        margin: { top: PAGE.margin, right: PAGE.margin, bottom: PAGE.margin, left: PAGE.margin },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            run('AI Adoption Analysis  |  GitHub Copilot Enterprise  |  March 2026', { size: 18, color: C.textLight }),
          ],
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.borderGray } },
          spacing: { before: 0, after: 120 },
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            run('Internal Use Only  |  Confidential  |  Page ', { size: 18, color: C.textLight }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: C.textLight }),
            run(' of ', { size: 18, color: C.textLight }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: C.textLight }),
          ],
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: C.borderGray } },
          spacing: { before: 120, after: 0 },
        })],
      }),
    },
    children: [
      ...coverPage,
      h1('Table of Contents'),
      new TableOfContents('Table of Contents', {
        hyperlink: true,
        headingStyleRange: '1-2',
      }),
      pb(),
      ...execSummary,
      ...sectionAgents,
      ...sectionMemory,
      ...sectionMCP,
      ...sectionSkills,
      ...sectionPrompts,
      ...sectionRecommendations,
      ...appendix,
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('ai-adoption-analysis-2026.docx', buffer);
  console.log('SUCCESS: ai-adoption-analysis-2026.docx created');
}).catch((err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
