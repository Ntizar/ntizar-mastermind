# Ntizar Mastermind v3 -- Architecture Deep Dive

> This document provides a detailed technical explanation of the system architecture for contributors and advanced users.

## Overview

Ntizar Mastermind v3 is a multi-agent AI orchestration framework built on two platforms:

- **Obsidian** -- knowledge vault, documentation layer, human-readable graph
- **OpenCode** -- execution engine, model routing, agent delegation via Task tool

The system handles any type of task: software development, research, strategy, writing, operations, knowledge management, creativity, and data analysis.

## The Two-Layer Architecture

### Why Two Layers?

Previous versions (v1, v2) stored everything in a single set of files. This led to:
- Obsidian wikilinks breaking OpenCode YAML parsing
- Duplicated content across documentation and execution configs
- Bloated executable files that wasted tokens on every agent invocation

v3 solves this with strict separation:

```
DOCUMENTAL LAYER                    EXECUTABLE LAYER
agents/XX-name.md                   .opencode/agents/ntizar-XX.md
|                                   |
| - Full mission statement          | - YAML frontmatter (model, tools)
| - Obsidian wikilinks              | - Minimal operational instructions
| - Rich context & examples         | - Reference to Obsidian doc
| - Interconnection map             | - Output format spec
| - Human-readable format           | - Machine-executable format
```

**Key rule:** The `.opencode/` file says `"Read agents/XX-name.md for full context"` instead of duplicating content. This achieved a 42% reduction in executable layer tokens.

### Synchronization Protocol

Changes follow this pattern:
1. Modify the Obsidian doc (source of truth)
2. Update the `.opencode/` file only if operational behavior changes
3. Both files reference each other for traceability

## Agent Pipeline

### Classification (Integrated in Orchestrator)

The Classifier was merged into the Orchestrator in v3 because it needs full conversation context, which OpenCode subagents don't receive. It evaluates:

- **Type:** software, research, strategy, writing, operations, knowledge, creativity, data
- **Complexity:** 1-5 scale
- **Domain:** matched against skills index
- **Ambiguity:** low/medium/high
- **Impact:** low/medium/high

### Flow Selection

| Complexity | Flow |
|-----------|------|
| 1-2 (simple) | CLASSIFY -> IMPLEMENT -> REVIEW -> SYNTHESIZE |
| 3 (medium) | CLASSIFY -> EXPLORE -> PLAN -> IMPLEMENT -> REVIEW -> SYNTHESIZE -> ARCHIVE |
| 4-5 (complex) | CLASSIFY -> EXPLORE -> PLAN -> SPEC -> IMPLEMENT -> REVIEW -> CRITICIZE -> SYNTHESIZE -> ARCHIVE |

### Agent Communication

Agents communicate through **structured reports** with mandatory sections:
- Explorer: `EXPLORER REPORT` (max 500 tokens)
- Planner: `PLAN v1` with objective, criteria, steps, risks
- Spec Writer: `SPEC v1` (max 700 tokens) -- requires human approval
- Implementer: `IMPLEMENTER REPORT` + deliverables
- Reviewer: `REVIEWER REPORT` with PASS/FAIL per criterion
- Critic: `CRITIC REPORT` with APPROVE/REVIEW/REJECT
- Synthesizer: `RESULTADO` with next action

## Memory System

### Ebbinghaus Decay Formula

```
R(t) = a / (log(t+1))^b + c
```

Parameters per decay type:

| Type | a | b | c | Behavior |
|------|---|---|---|----------|
| permanente | - | - | 1.0 | Always R=1.0 |
| lento | 0.9 | 0.5 | 0.15 | Slow decline, high baseline |
| normal | 0.8 | 0.7 | 0.08 | Standard decline |
| rapido | 0.7 | 1.0 | 0.02 | Fast decline, near-zero baseline |

### Loading Protocol

1. At session start, orchestrator reads `agents/learnings/_index.md` (lightweight table only)
2. For each task, matches `signal_of_relevance` column against current task keywords
3. Loads individual learning files only when: `R(t) > 0.3 AND signal matches`
4. Under token pressure: raises threshold to `R(t) > 0.5`
5. Learnings with `R(t) < 0.2` for 60+ days become candidates for archival

### Archival Process

The Librarian agent periodically proposes archival of decayed learnings:
1. Identifies learnings below threshold for extended periods
2. Proposes archival to the human
3. Human approves or rejects
4. Archived learnings are removed from active index but preserved in the vault

## Skills Architecture

Skills are loaded on-demand when the Classifier detects a matching domain. Each skill defines:

- **Phases:** ordered steps for the domain workflow
- **Decision matrix:** when to apply which approach
- **Rules:** domain-specific constraints
- **Patterns:** proven solutions
- **Anti-patterns:** common mistakes to avoid

The `dashboard-dev` skill includes a unique feature: **dynamic re-learning**. The Librarian periodically reviews learnings tagged with the `datos` cluster and aggregates common patterns into the skill file itself, making the skill smarter over time.

## Knowledge Graph

### Clusters

Clusters are dynamic categories that grow organically. They are never pre-defined as a closed set:

- `#sistema` -- the agent system itself
- `#web` -- frontend, hosting, deployment
- `#github` -- version control, CI/CD
- `#arquitectura-software` -- APIs, integration patterns
- `#datos` -- dashboards, data visualization
- `#finanzas-tech` -- financial analysis with code
- `#mobile` -- PWA, native apps

### Cross-References

Projects reference clusters. Learnings reference projects and clusters. Skills reference clusters. This creates a navigable knowledge graph in Obsidian's graph view.

## Model Allocation Strategy

The multi-model system works on a "propose-confirm" pattern:

1. Orchestrator evaluates the task and proposes models per agent
2. Human confirms or adjusts
3. Each agent's `.opencode/` YAML specifies the assigned model

### Degradation Rules

- **Critic:** NEVER degrades. Omit entirely if best model unavailable. Notify human.
- **Orchestrator:** Requires high-capability model. No degradation.
- **Explorer/Reviewer:** Can degrade one tier (e.g., Opus -> Sonnet)
- **Synthesizer/Archiver/Librarian:** Can run on cheapest available model

## File Reference

| File | Purpose | Layer |
|------|---------|-------|
| `AGENTS.md` | System entry point, read first | Root |
| `agents/state/_system-config.md` | Portable config, model tables | Documental |
| `agents/state/_session-state.md` | Live session rules (R1-R12) | Documental |
| `agents/learnings/_index.md` | Master learning index with decay | Documental |
| `agents/skills/_index.md` | Skills registry | Documental |
| `agents/projects/_clusters.md` | Knowledge graph | Documental |
| `.opencode/commands/ntizar-start.md` | Boot sequence | Executable |
| `verify-system.bat` | Installation verifier | Utility |
