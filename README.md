# Project Orchestrator Skill

Autonomous project builder for AI agents. Takes requirements, spawns specialized sub-agents in parallel, delivers working projects.

## Installation

### As a Skill (for Kilo, Claude Code, etc.)

```bash
# Clone to your skills directory
git clone https://github.com/iftekharmahmudhimu-coder/project-orchestrator ~/.your-ai/skills/project-orchestrator

# Or add to kilo.json
{
  "skills": ["project-orchestrator"]
}
```

### As an npm Package

```bash
npm install -g project-orchestrator-skill
```

## Usage

### With AI Agent (Recommended)

Once installed as a skill, just tell your AI:

> "Build a real-time chat app with React, Node, Socket.io, and PostgreSQL"

The orchestrator will:
1. Analyze requirements & confirm tech stack
2. Decompose into 25+ tasks across 6 phases
3. Spawn 5-8 specialized sub-agents in parallel
4. Coordinate execution with dependency management
5. Verify each phase (lint, type-check, unit, e2e, docker)
6. Deliver production-ready codebase

### CLI

```bash
# Initialize in a project
project-orchestrator init

# Create plan from requirements
project-orchestrator plan requirements.md

# Execute plan (requires AI runtime with task tool)
project-orchestrator run .orchestrator/task-graph.json

# Check progress
project-orchestrator status
```

## How It Works

```
Requirements → Stack Detection → Task Decomposition → Parallel Agent Execution → Verification Gates → Delivery
```

### 6 Phases (Parallel Within Phase)

| Phase | Tasks | Verification |
|-------|-------|--------------|
| 0: Foundation | Git, lint, CI/CD, structure | `build && lint` |
| 1: Infrastructure | DB, Docker, env, Dockerfile | `build && lint` |
| 2: Core Domain | Models, repos, services, validation | `typecheck && test:unit` |
| 3: API Layer | Routes, controllers, auth, security | `typecheck && test:unit` |
| 4: Frontend | Components, pages, state, API client | `test:components && build` |
| 5: Integration | E2E, unit tests, docs, perf, security, a11y | `test:e2e && test:all` |
| 6: Deploy Prep | Prod Dockerfile, health checks, monitoring, seeds | `docker build && smoke-test` |

### Sub-Agent Specialization

| Role | Focus |
|------|-------|
| Setup/Config | Package.json, TS/ESLint, CI, structure |
| Database | Migrations, schemas, indexes, seeds |
| Backend/API | Routes, controllers, services, auth |
| Frontend | Components, pages, state, forms |
| Testing | Unit, integration, E2E |
| DevOps | Docker, CI/CD, monitoring, health checks |

## Integration

### Kilo / Kilocode

Add to `.kilo/agent/agent.json` or `kilo.json`:

```json
{
  "skills": ["project-orchestrator"]
}
```

### Claude Code

Copy to `~/.claude/skills/project-orchestrator/`

### Custom AI Runtime

The skill exports a `ProjectOrchestrator` class:

```javascript
import { ProjectOrchestrator } from 'project-orchestrator-skill';

const orchestrator = new ProjectOrchestrator('/path/to/project');
await orchestrator.init();
await orchestrator.plan('requirements.md');
// Spawn agents using your runtime's task/spawn mechanism
```

## Requirements

- Node.js 20+
- AI runtime with `task`/`spawn` capability for sub-agents
- Git (for version control)

## License

MIT