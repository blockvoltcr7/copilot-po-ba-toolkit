---
name: skill-creator
description: Guide for creating effective skills. Use when the user wants to create a new skill (or update an existing skill) that extends The AI Model's capabilities with specialized knowledge, workflows, or tool integrations. Triggers on requests like "create a skill for X", "add a new skill", "build a skill that does Y", or "update the existing skill".
---

# Skill Creator

This skill provides guidance for creating effective skills for this project.

## About Skills

Skills are modular, self-contained packages that extend The AI Model's capabilities by providing
specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific
domains or tasks.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

## Core Principles

### Concise is Key

The context window is a public good. Only add context The AI Model doesn't already have. Challenge each piece: "Does The AI Model really need this?" Prefer concise examples over verbose explanations.

### Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
└── Bundled Resources (optional)
    ├── scripts/     - Executable code (Python/Bash/etc.)
    ├── references/  - Documentation loaded into context as needed
    └── assets/      - Files used in output (templates, icons, fonts, etc.)
```

Skills in this project live in `.github/skills/`.

### Progressive Disclosure

1. **Metadata (name + description)** — Always in context (~100 words)
2. **SKILL.md body** — When skill triggers (<5k words, <500 lines)
3. **Bundled resources** — Read by The AI Model only as needed

Move detailed reference material, schemas, and examples to `references/` files. Keep only essential workflow guidance in SKILL.md.

## Skill Creation Process

1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill (`scripts/init_skill.py`)
4. Edit the skill (implement resources and write SKILL.md)
5. Package the skill (`scripts/package_skill.py`)
6. Iterate based on real usage

### Step 1: Understand with Concrete Examples

Ask the user:
- "What would trigger this skill?" (specific phrases/scenarios)
- "Can you give me 2-3 examples of how it would be used?"

### Step 2: Plan Reusable Contents

For each example, ask:
1. What would I do from scratch to handle this?
2. What scripts/references/assets would speed this up repeatedly?

### Step 3: Initialize

Run from the skill-creator scripts directory:

```bash
python .github/skills/skill-creator/scripts/init_skill.py <skill-name> --path .github/skills
```

### Step 4: Edit

- **SKILL.md frontmatter**: `name` and `description` only. Description is the trigger — be specific about when to use the skill.
- **SKILL.md body**: Imperative form. Core workflow only. Link to reference files for details.
- **references/**: Detailed docs, schemas, examples. Loaded only when needed.
- **scripts/**: Executable automation. Test all scripts before shipping.
- **assets/**: Templates, boilerplate. Not loaded into context.

For design patterns, see:
- **Multi-step workflows**: `references/workflows.md`
- **Output templates and examples**: `references/output-patterns.md`

### Step 5: Package

```bash
python .github/skills/skill-creator/scripts/package_skill.py .github/skills/<skill-name>
```

Validates structure and produces a `.skill` distributable file.

### Step 6: Iterate

Use the skill on real tasks, notice gaps, update SKILL.md or references, repeat.

## What NOT to Include

- README.md, CHANGELOG.md, INSTALLATION_GUIDE.md — no auxiliary docs
- Information The AI Model already knows from training
- Deeply nested reference structures (keep references one level deep)
