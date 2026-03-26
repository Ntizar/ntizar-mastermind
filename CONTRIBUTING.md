# Contributing to Ntizar Mastermind

First off, thanks for considering contributing to Ntizar Mastermind. This project thrives on community input.

## How Can I Contribute?

### 1. New Skills

Skills are domain-specific playbooks that agents load when relevant. To create a new skill:

1. Copy `agents/skills/template-skill.md`
2. Fill in the domain, phases, decision matrix, rules, patterns, and anti-patterns
3. Register it in `agents/skills/_index.md`
4. Submit a PR with the skill file + updated index

**Good skill candidates:** DevOps, data science, mobile development, content writing, project management, API design, testing strategies, etc.

### 2. Agent Optimizations

The agent prompts in `.opencode/agents/` and `agents/` can always be improved:

- Better classification accuracy
- Smarter flow selection
- More efficient token usage
- Clearer output formats

### 3. Learning Platform

The learning platform (`learning-platform/`) needs:

- Content improvements and corrections
- New interactive examples
- Accessibility improvements
- Translations (currently Spanish-only)
- Mobile responsiveness fixes

### 4. Documentation

- Tutorials and how-to guides
- Video walkthroughs
- Use case examples
- Translation of docs

### 5. MCP Integration (v3.1)

This is the next major milestone. If you have experience with:

- Model Context Protocol (MCP)
- Multi-agent communication patterns
- Token optimization strategies
- Streaming/parallel execution

We'd love your input on the architecture.

## Development Setup

1. Clone the repo
2. Open as an Obsidian vault
3. Configure OpenCode with your API keys
4. Run `verify-system.bat` to confirm everything is in place
5. Use `/ntizar-start` to boot the system

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-new-skill`)
3. Make your changes
4. Test that the system still boots correctly (`verify-system.bat`)
5. Update relevant documentation
6. Submit a PR with a clear description of what changed and why

## Guidelines

- **Keep the two-layer architecture** -- changes to agent behavior should update both the Obsidian doc (`agents/`) and the OpenCode config (`.opencode/agents/`)
- **No duplication** -- the executable layer references the documental layer, not the other way around
- **Test your changes** -- run at least one full task cycle through the system
- **Follow existing patterns** -- look at how current skills, learnings, and templates are structured before creating new ones
- **Document decay types** -- if adding learnings, assign appropriate decay types with reasoning

## Code of Conduct

Be respectful, constructive, and focused on making the system better. We're all here to learn.

## Questions?

Open an issue or start a discussion. We're happy to help you get started.
