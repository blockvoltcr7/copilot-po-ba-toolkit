/**
 * Example: Professional Report Template
 *
 * This script generates a complete Word document with:
 * - Custom heading styles
 * - Bullet and numbered lists (using numbering config)
 * - A styled comparison table with header shading
 * - Headers and footers with page numbers
 * - Page breaks between sections
 *
 * Usage: npm install docx && node report-template.js
 * Output: report.docx
 */

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require('docx');

// --- Helper functions ---

function heading(level, text) {
  return new Paragraph({
    heading: level,
    children: [new TextRun(text)]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    style: "Normal",
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun(typeof text === 'string' ? { text, font: "Arial", size: 24, ...opts.run } : text)]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    style: "Normal",
    numbering: { reference: "bullets", level },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 24 })]
  });
}

function numbered(text, reference = "advantages-numbers", level = 0) {
  return new Paragraph({
    style: "Normal",
    numbering: { reference, level },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 24 })]
  });
}

// --- Table helpers ---

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "2E75B6", type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 22 })]
    })]
  });
}

function dataCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: cellMargins,
    children: [new Paragraph({
      children: [new TextRun({ text, font: "Arial", size: 22 })]
    })]
  });
}

// --- Build the document ---

const colWidths = [2340, 2340, 2340, 2340]; // 4 columns, sum = 9360

const doc = new Document({
  title: "The Current State of AI Agents Using Skills",
  description: "Trade-offs of Prompt Templates for Agent Skills",
  creator: "AI Agents Skills Team",
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Normal", name: "Normal",
        run: { font: "Arial", size: 24 },
        paragraph: { spacing: { after: 120 } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 180 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ] },
      { reference: "advantages-numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ] },
      { reference: "disadvantages-numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            new TextRun({ text: "AI Agents Skills Report", bold: true, size: 18, color: "888888" })
          ],
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } }
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 18, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" }),
            new TextRun({ text: " of ", size: 18, color: "888888" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "888888" }),
          ]
        })]
      })
    },
    children: [
      // --- Title Page ---
      new Paragraph({ style: "Normal", spacing: { before: 4000 }, children: [] }),
      new Paragraph({
        style: "Normal",
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "The Current State of AI Agents Using Skills", bold: true, font: "Arial", size: 52, color: "1F4E79" })]
      }),
      new Paragraph({
        style: "Normal",
        alignment: AlignmentType.CENTER,
        spacing: { before: 240 },
        children: [new TextRun({ text: "Trade-offs of Prompt Templates for Agent Skills", font: "Arial", size: 32, color: "2E75B6" })]
      }),
      new Paragraph({
        style: "Normal",
        alignment: AlignmentType.CENTER,
        spacing: { before: 480 },
        children: [new TextRun({ text: "March 2026", font: "Arial", size: 24, color: "666666" })]
      }),

      // --- Page break ---
      new Paragraph({ children: [new PageBreak()] }),

      // --- Executive Summary ---
      heading(HeadingLevel.HEADING_1, "Executive Summary"),
      para("AI agents are increasingly relying on modular skill systems to extend their capabilities beyond base model knowledge. Skills — curated packages of instructions, examples, and resources — allow agents to perform specialized tasks like generating documents, debugging CI pipelines, or writing tests in framework-specific patterns."),
      para("This report examines the current landscape of agent skill implementations, with a focus on the trade-offs of using prompt templates as the primary mechanism for skill delivery. While prompt-based skills offer unmatched simplicity and portability, they come with significant limitations around context consumption, fragility, and scalability."),

      // --- What Are Agent Skills ---
      heading(HeadingLevel.HEADING_1, "What Are Agent Skills?"),
      para("An agent skill is a modular unit of domain knowledge that can be injected into an agent's context when relevant. Unlike fine-tuning (which bakes knowledge into weights) or RAG (which retrieves from a corpus), prompt-template skills are self-contained instruction sets that teach an agent how to perform a specific task."),

      heading(HeadingLevel.HEADING_2, "Key Characteristics"),
      bullet("Modular: each skill lives in its own directory with a SKILL.md file"),
      bullet("Conditional: only loaded when the agent determines relevance"),
      bullet("Portable: the same skill works across multiple agent frameworks"),
      bullet("Composable: agents can load multiple skills for complex tasks"),

      // --- Implementation Approaches ---
      heading(HeadingLevel.HEADING_1, "Implementation Approaches"),

      heading(HeadingLevel.HEADING_2, "1. Prompt Template Injection"),
      para("The skill is a text file (e.g., SKILL.md) injected into the system prompt or agent context. The agent reads it and follows the instructions. This is how Claude Code, GitHub Copilot CLI, and VS Code agent mode implement skills."),
      bullet("Examples: .claude/skills/, .github/skills/, ~/.copilot/skills/"),
      bullet("Format: Markdown with YAML frontmatter (name, description)"),
      bullet("Activation: automatic (model-invoked) or manual (slash command)"),

      heading(HeadingLevel.HEADING_2, "2. Tool/Function Definitions"),
      para("Skills are expressed as structured tool schemas with typed inputs and outputs. The agent calls tools rather than following prose instructions."),
      bullet("Examples: OpenAI function calling, Anthropic tool_use, MCP servers"),
      bullet("Format: JSON Schema for inputs, structured responses"),

      heading(HeadingLevel.HEADING_2, "3. RAG-Based Skill Retrieval"),
      para("Skills are stored in a vector database and retrieved based on semantic similarity to the user's query."),
      bullet("Examples: LangChain retrievers, custom embedding pipelines"),
      bullet("Scales to thousands of skills without context window limits"),

      heading(HeadingLevel.HEADING_2, "4. Fine-Tuned Specialist Models"),
      para("Domain knowledge is baked into the model weights through fine-tuning or distillation."),
      bullet("Examples: Code-specific models, domain-adapted LLMs"),
      bullet("No runtime context cost, but expensive to update"),

      // --- Page break ---
      new Paragraph({ children: [new PageBreak()] }),

      // --- Trade-offs ---
      heading(HeadingLevel.HEADING_1, "Trade-offs of Prompt Template Skills"),

      heading(HeadingLevel.HEADING_2, "Advantages"),
      numbered("Zero infrastructure — just text files in a directory. No databases, no servers, no build steps."),
      numbered("Highly flexible — iterate by editing a Markdown file. Changes take effect immediately."),
      numbered("Universal compatibility — works with any LLM that accepts system prompts."),
      numbered("Transparent — the skill is human-readable; you can audit exactly what the agent sees."),
      numbered("Portable — the Agent Skills spec is an open standard across Claude Code, Copilot CLI, and VS Code."),

      heading(HeadingLevel.HEADING_2, "Disadvantages"),
      numbered("Context window consumption — each loaded skill eats tokens, reducing space for user content and conversation history.", "disadvantages-numbers"),
      numbered("Fragility — subtle prompt changes can break agent behavior in unpredictable ways.", "disadvantages-numbers"),
      numbered("No type safety — skill outputs are unstructured text; there is no schema validation.", "disadvantages-numbers"),
      numbered("Scaling limits — loading many skills simultaneously hits context limits quickly.", "disadvantages-numbers"),
      numbered("Versioning difficulty — no built-in mechanism for skill versions, rollbacks, or A/B testing.", "disadvantages-numbers"),
      numbered("Testing gaps — no standard framework for unit-testing skill behavior.", "disadvantages-numbers"),

      // --- Comparison Table ---
      new Paragraph({ children: [new PageBreak()] }),
      heading(HeadingLevel.HEADING_1, "Comparison Table"),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: colWidths,
        rows: [
          new TableRow({
            children: [
              headerCell("Dimension", colWidths[0]),
              headerCell("Prompt Templates", colWidths[1]),
              headerCell("Tool-Based", colWidths[2]),
              headerCell("Fine-Tuned", colWidths[3]),
            ]
          }),
          ...([
            ["Setup Cost", "Very Low", "Medium", "Very High"],
            ["Iteration Speed", "Instant", "Fast", "Slow (retrain)"],
            ["Context Cost", "High", "Low", "None"],
            ["Type Safety", "None", "Strong (schema)", "N/A"],
            ["Scalability", "Limited by tokens", "Limited by tools", "Unlimited"],
            ["Portability", "Excellent", "Framework-specific", "Model-specific"],
            ["Auditability", "High (readable text)", "Medium (schemas)", "Low (weights)"],
            ["Versioning", "Manual (git)", "API versioning", "Model checkpoints"],
          ].map(([dim, prompt, tool, fine]) =>
            new TableRow({
              children: [
                dataCell(dim, colWidths[0]),
                dataCell(prompt, colWidths[1]),
                dataCell(tool, colWidths[2]),
                dataCell(fine, colWidths[3]),
              ]
            })
          ))
        ]
      }),

      // --- Recommendations ---
      heading(HeadingLevel.HEADING_1, "Recommendations"),
      para("Choose the skill implementation based on your constraints:"),
      bullet("Use prompt templates when: you need fast iteration, cross-agent portability, or are working with a small number of specialized skills."),
      bullet("Use tool definitions when: you need structured I/O, type safety, or are building production pipelines with predictable behavior."),
      bullet("Use RAG retrieval when: you have hundreds of skills and cannot afford to load them all into context."),
      bullet("Use fine-tuning when: the skill is core to your product, used on every request, and must not consume runtime tokens."),

      // --- Conclusion ---
      heading(HeadingLevel.HEADING_1, "Conclusion"),
      para("Prompt template skills have emerged as the dominant approach for agent customization due to their simplicity, portability, and zero-infrastructure requirements. The convergence around a shared SKILL.md format across Claude Code, GitHub Copilot CLI, and VS Code signals that this pattern is becoming a de facto standard."),
      para("However, the trade-offs are real: context window consumption, fragility, and lack of type safety mean that prompt-template skills work best for focused, high-value capabilities rather than as a general-purpose knowledge layer. The most effective agent architectures will likely combine prompt-template skills for specialized tasks with tool-based integrations for structured workflows and RAG for broad knowledge retrieval."),
    ]
  }]
});

// --- Write the file ---
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("ai_agents_skills_report.docx", buffer);
  console.log("Created: ai_agents_skills_report.docx (" + (buffer.length / 1024).toFixed(1) + " KB)");
});
