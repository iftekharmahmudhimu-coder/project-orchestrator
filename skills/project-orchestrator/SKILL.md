---
name: project-orchestrator
description: Autonomous project builder. Takes requirements, spawns specialized sub-agents in parallel, delivers working projects. Any stack, any project type.
license: MIT
metadata:
  version: "1.0.0"
---

# Project Orchestrator

Senior eng lead: decomposes requirements → spawns parallel sub-agents → verifies end-to-end → delivers production-ready code.

## Input
Any format: natural language, requirements.md, user stories, OpenAPI, DB schema, Mermaid diagrams.

## Stack Selection
| Type | Defaults |
|------|----------|
| Web | React/Vue/Svelte + Node/Go/Python + PostgreSQL |
| Mobile | React Native/Flutter + Firebase/Supabase |
| CLI | Go/Rust/Node + Commander/Cobra |
| API | FastAPI/Express/NestJS/Hono + PostgreSQL/Redis |
| Full-stack | Next.js/Nuxt/Remix + Prisma/Drizzle + PostgreSQL |
| Real-time | Socket.io/PartyKit + Redis + React/Vue |
| AI/ML | Python/FastAPI + LangChain/Pydantic AI + Vector DB |

**Confirm stack unless user says "you choose".**

## 6-Phase Execution (Parallelize Within Phase)

```
Phase 0: Foundation     → git, lint, CI/CD, structure
Phase 1: Infra          → DB, Docker, env, Dockerfile
Phase 2: Core Domain    → models, repos, services, validation
Phase 3: API Layer      → routes, controllers, auth, security
Phase 4: Frontend       → components, pages, state, API client
Phase 5: Integration    → e2e, unit tests, docs, perf, security, a11y
Phase 6: Deploy Prep    → prod Dockerfile, health checks, monitoring, seeds
```

## Sub-Agent Spawning

Use `task` tool, `background: true` for parallel. Agent types:
- `general`: setup, backend, database, testing, DevOps, review
- `explore`: UI research, then `general` for implementation

**Prompt template:**
```
Role: [specialist role]
Task: [specific, acceptance criteria]
Context: [files, conventions, deps]
Stack: [exact versions, libs]
Output: [files to create/modify, verify cmds]
Constraints: Follow patterns. No new deps without approval.
```

## Coordination
- Task specs: `.orchestrator/tasks/*.json`
- Results: `.orchestrator/results/`
- Graph: `.orchestrator/task-graph.json` (deps, phases)
- Progress: `.orchestrator/progress.json`
- Cross-agent: `board_post` (blockers, handoffs)

**Spawn only when deps = completed. Phase gates enforced.**

## Verification Gates (Run After Each Phase)
```bash
# 0-1: Build & Lint
npm run build && npm run lint

# 2-3: Type-check & Unit
npm run typecheck && npm run test:unit

# 4: Component Tests + Build
npm run test:components && npm run build

# 5: E2E + Full Suite
npm run test:e2e && npm run test:all

# 6: Docker + Smoke
docker build -t project . && docker run --rm project npm run smoke-test
```
**Stop on failure. Fix or escalate.**

## Quality Checklist (Every Deliverable)
- ✅ All lint/type/test pass
- ✅ Follows existing conventions
- ✅ Tests for new code
- ✅ No hardcoded secrets
- ✅ Error handling (no unhandled promises)
- ✅ Accessible (semantic HTML, ARIA)
- ✅ Responsive (mobile-first)
- ✅ Proper TS types (no unjustified `any`)

## Final Delivery
1. Full test suite → production build → smoke test
2. Summary: structure, key files, run cmds, test results, known TODOs
3. Offer commit

## Error Handling
- Agent fail → retry once with more context → escalate
- Verify fail → analyze → spawn fix agent → re-verify
- Dep conflict → pause deps → resolve → resume
- Scope creep → confirm with user
- Timeout: 30min default/task

## Token Efficiency
- Reference files are concise specs, not tutorials
- Agents read only their task spec + relevant project files
- No redundant context passing
- Parallel execution minimizes total turns