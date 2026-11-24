# Progress Tracking Format

## `.orchestrator/progress.json`
```json
{
  "project": "project-name",
  "started": "2026-11-24T06:00:00Z",
  "currentPhase": 2,
  "phases": [
    { "id": 0, "name": "Foundation", "status": "completed", "tasks": 5, "completed": 5 },
    { "id": 1, "name": "Infrastructure", "status": "completed", "tasks": 4, "completed": 4 },
    { "id": 2, "name": "Core Domain", "status": "in_progress", "tasks": 8, "completed": 3 },
    { "id": 3, "name": "API Layer", "status": "pending", "tasks": 6, "completed": 0 },
    { "id": 4, "name": "Frontend", "status": "pending", "tasks": 10, "completed": 0 },
    { "id": 5, "name": "Integration", "status": "pending", "tasks": 7, "completed": 0 },
    { "id": 6, "name": "Deploy Prep", "status": "pending", "tasks": 4, "completed": 0 }
  ],
  "tasks": {
    "task-001": { "status": "completed", "agentId": "agent-1", "durationMs": 45000 },
    "task-002": { "status": "completed", "agentId": "agent-2", "durationMs": 38000 },
    "task-003": { "status": "in_progress", "agentId": "agent-3", "started": "2026-11-24T06:05:00Z" },
    "task-004": { "status": "pending", "deps": ["task-003"] }
  },
  "summary": {
    "totalTasks": 44,
    "completed": 8,
    "inProgress": 1,
    "pending": 35,
    "failed": 0,
    "blocked": 0
  }
}
```

## Status Values
- `pending` - deps not met or not spawned
- `in_progress` - agent working
- `completed` - done, verified
- `failed` - agent error, needs retry/escalation
- `blocked` - waiting on external input

## Update Protocol
1. Orchestrator writes initial graph with all `pending`
2. On spawn: set `in_progress`, record `agentId`, `started`
3. On agent completion: set `completed`, record `durationMs`, `result`
4. On failure: set `failed`, record `error`, spawn retry or escalate
5. On blocker: set `blocked`, record `reason`, `waitingOn`
6. Phase complete: all tasks `completed` + verification passes

## User Reporting (Per Phase)
```
## Phase N: [Name] - [STATUS]

Completed: X/Y tasks
- task-001: ✅ [description] (files: a.ts, b.ts)
- task-002: ✅ [description]
- task-003: ❌ [error] → retrying...

Verification: [PASS/FAIL - output summary]

Next: Phase N+1 ([task count] tasks) - [ready/blocked]
```