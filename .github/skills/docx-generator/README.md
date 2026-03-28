# docx-generator Skill for GitHub Copilot CLI / Claude Code

A portable Agent Skill that teaches AI agents how to generate professional
Word (.docx) documents using Node.js and the `docx` npm package.

## What This Is

This is an **Agent Skill** — a folder with a `SKILL.md` file that gets
auto-injected into the agent's context when it determines the skill is
relevant to your prompt. It works across:

- **GitHub Copilot CLI** (`copilot`)
- **Claude Code** (`claude`)
- **VS Code Agent Mode** (Insiders + stable)
- **GitHub Copilot Coding Agent** (in PRs)

The same SKILL.md works across all of these because they all support the
Agent Skills open standard.

## Installation

### Option A: Personal skill (works in every project)

```bash
# For Copilot CLI
mkdir -p ~/.copilot/skills
cp -r docx-generator ~/.copilot/skills/

# For Claude Code (also picked up by Copilot)
mkdir -p ~/.claude/skills
cp -r docx-generator ~/.claude/skills/

# Either location works — both agents check both paths
```

### Option B: Project skill (scoped to one repo)

```bash
cd your-repo

# Pick ONE of these (all three are checked):
mkdir -p .github/skills
cp -r docx-generator .github/skills/

# OR
mkdir -p .claude/skills
cp -r docx-generator .claude/skills/

# OR
mkdir -p .agents/skills
cp -r docx-generator .agents/skills/
```

Then commit to your repo — anyone who clones it gets the skill.

### Option C: Via a Plugin Marketplace

If you're distributing this as part of a plugin, see
[GitHub's plugin docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating).

## Prerequisites

The skill requires Node.js to be available in the agent's environment.
The agent will `npm install docx` automatically when it uses the skill.

## Usage

### Automatic (model-invoked)

Just ask naturally — the agent reads the skill's `description` field and
loads the skill when relevant:

```
copilot> Generate a Word document report on Q3 sales results with a
         comparison table and executive summary

# The agent will:
# 1. Match your prompt to the docx-generator skill
# 2. Load the SKILL.md into context
# 3. Run npm install docx
# 4. Write a Node.js script following the skill's patterns
# 5. Execute it → produce the .docx file
```

### Explicit (slash command)

```
copilot> /docx-generator Create a formatted proposal document with
         headings, bullet lists, and a pricing table
```

### Verify the skill is loaded

```
copilot> /skills list
# Should show: docx-generator — Generate professional Word (.docx) documents...

copilot> /skills info docx-generator
# Shows full details and file location
```

## How It Works

```
┌─────────────────────────────────────────────────────┐
│                     Your Prompt                      │
│  "Create a Word doc report on AI agents..."          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               Agent Skill Discovery                  │
│  Agent reads skill names + descriptions              │
│  Matches "Word doc" → docx-generator skill           │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│             SKILL.md Injected into Context            │
│  Agent now has docx-js API patterns, rules, gotchas  │
│  + access to examples/report-template.js             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              Agent Writes & Executes Code             │
│  1. npm install docx                                 │
│  2. Writes generate-report.js (following SKILL.md)   │
│  3. node generate-report.js                          │
│  4. Verifies output.docx exists                      │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
                  📄 output.docx
```

## File Structure

```
docx-generator/
├── SKILL.md                        # Skill definition + instructions
├── examples/
│   └── report-template.js          # Full working example script
└── README.md                       # This file
```

## Customization

Edit the `SKILL.md` to:
- Add your company's branding (colors, fonts, logo)
- Include default header/footer text
- Add more example patterns
- Restrict to specific document types

## How This Relates to Claude Code's Built-in Skills

This is the **exact same pattern** Claude.ai and Claude Code use internally.
The only difference is:

| | Claude.ai / Claude Code | This Skill |
|---|---|---|
| **Skill location** | Built into the platform at `/mnt/skills/` | Your `~/.copilot/skills/` or repo |
| **Agent** | Claude (Anthropic) | Copilot (GitHub) or Claude Code |
| **Execution** | Sandboxed Linux container | Your local terminal |
| **Content** | Same docx-js knowledge | Same docx-js knowledge |

The skill is just text. The knowledge is portable. Any agent that can
read a SKILL.md and run shell commands can generate Word docs.
