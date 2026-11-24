#!/usr/bin/env node
import { ProjectOrchestrator } from '../src/index.js';

const orchestrator = new ProjectOrchestrator();

const command = process.argv[2];

switch (command) {
  case 'init':
    await orchestrator.init();
    break;
  case 'plan':
    await orchestrator.plan(process.argv[3]);
    break;
  case 'run':
    await orchestrator.run(process.argv[3]);
    break;
  case 'status':
    await orchestrator.status();
    break;
  default:
    console.log(`
Project Orchestrator Skill v1.0.0

Usage:
  project-orchestrator init                    # Initialize project structure
  project-orchestrator plan <requirements>     # Create execution plan from requirements
  project-orchestrator run <plan-file>         # Execute the plan
  project-orchestrator status                  # Show current progress

Integration:
  Add to your AI's skills directory:
    cp -r skills/project-orchestrator ~/.your-ai/skills/

  Or reference in your kilo.json:
    "skills": ["project-orchestrator"]
`);
    process.exit(1);
}