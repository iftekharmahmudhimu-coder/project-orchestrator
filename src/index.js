import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

export class ProjectOrchestrator {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.orchestratorDir = join(projectRoot, '.orchestrator');
    this.skillsDir = join(projectRoot, 'skills', 'project-orchestrator');
  }

  async init() {
    await mkdir(this.orchestratorDir, { recursive: true });
    await mkdir(join(this.orchestratorDir, 'tasks'), { recursive: true });
    await mkdir(join(this.orchestratorDir, 'results'), { recursive: true });
    console.log('✅ Project Orchestrator initialized');
    console.log(`   Workspace: ${this.orchestratorDir}`);
  }

  async plan(requirementsPath) {
    const requirements = await this.loadRequirements(requirementsPath);
    const stack = await this.detectStack(requirements);
    const tasks = this.decompose(requirements, stack);
    const graph = this.buildTaskGraph(tasks, stack);
    
    await writeFile(
      join(this.orchestratorDir, 'task-graph.json'),
      JSON.stringify(graph, null, 2)
    );
    
    await writeFile(
      join(this.orchestratorDir, 'progress.json'),
      JSON.stringify(this.initialProgress(graph), null, 2)
    );
    
    console.log(`📋 Plan created: ${tasks.length} tasks across ${graph.phases.length} phases`);
    console.log(`   Stack: ${JSON.stringify(stack)}`);
    console.log(`   Graph: ${join(this.orchestratorDir, 'task-graph.json')}`);
  }

  async run(planFile) {
    const graph = JSON.parse(await readFile(planFile || join(this.orchestratorDir, 'task-graph.json'), 'utf-8'));
    console.log(`🚀 Executing plan: ${graph.project}`);
    // Execution logic would spawn sub-agents here
    console.log('   (Execution requires AI agent runtime with task tool)');
  }

  async status() {
    try {
      const progress = JSON.parse(await readFile(join(this.orchestratorDir, 'progress.json'), 'utf-8'));
      console.log(`📊 Project: ${progress.project}`);
      console.log(`   Phase: ${progress.currentPhase} / ${progress.phases.length - 1}`);
      console.log(`   Tasks: ${progress.summary.completed}/${progress.summary.totalTasks} completed`);
      progress.phases.forEach(p => {
        const icon = p.status === 'completed' ? '✅' : p.status === 'in_progress' ? '🔄' : '⏳';
        console.log(`   ${icon} Phase ${p.id}: ${p.name} (${p.completed}/${p.tasks})`);
      });
    } catch {
      console.log('No active project. Run "project-orchestrator plan <requirements>" first.');
    }
  }

  async loadRequirements(path) {
    // Load from file, stdin, or prompt
    return { description: 'Project requirements', path };
  }

  async detectStack(requirements) {
    // Infer stack from requirements or use defaults
    return {
      type: 'web',
      frontend: 'react',
      backend: 'node',
      database: 'postgresql',
      orm: 'prisma',
      styling: 'tailwind',
      testing: 'vitest+playwright'
    };
  }

  decompose(requirements, stack) {
    // Return task array based on 6-phase model
    return [
      { id: 'task-001', name: 'Init repo & config', phase: 0, role: 'setup', deps: [] },
      { id: 'task-002', name: 'CI/CD pipeline', phase: 0, role: 'setup', deps: ['task-001'] },
      { id: 'task-003', name: 'Database schema & migrations', phase: 1, role: 'database', deps: ['task-001'] },
      { id: 'task-004', name: 'Docker compose & env', phase: 1, role: 'devops', deps: ['task-001'] },
      { id: 'task-005', name: 'Core models & repositories', phase: 2, role: 'backend', deps: ['task-003'] },
      { id: 'task-006', name: 'Business logic services', phase: 2, role: 'backend', deps: ['task-005'] },
      { id: 'task-007', name: 'API routes & controllers', phase: 3, role: 'backend', deps: ['task-006'] },
      { id: 'task-008', name: 'Auth & validation', phase: 3, role: 'backend', deps: ['task-007'] },
      { id: 'task-009', name: 'UI components & pages', phase: 4, role: 'frontend', deps: ['task-007'] },
      { id: 'task-010', name: 'State & API client', phase: 4, role: 'frontend', deps: ['task-009'] },
      { id: 'task-011', name: 'Unit & integration tests', phase: 5, role: 'testing', deps: ['task-008', 'task-010'] },
      { id: 'task-012', name: 'E2E tests', phase: 5, role: 'testing', deps: ['task-011'] },
      { id: 'task-013', name: 'Production Dockerfile', phase: 6, role: 'devops', deps: ['task-012'] },
      { id: 'task-014', name: 'Health checks & monitoring', phase: 6, role: 'devops', deps: ['task-013'] }
    ];
  }

  buildTaskGraph(tasks, stack) {
    const phases = [...new Set(tasks.map(t => t.phase))].sort((a, b) => a - b);
    return {
      project: 'generated-project',
      stack,
      phases: phases.map(p => ({
        id: p,
        name: ['Foundation', 'Infrastructure', 'Core Domain', 'API Layer', 'Frontend', 'Integration', 'Deploy Prep'][p],
        parallel: p > 0,
        tasks: tasks.filter(t => t.phase === p)
      }))
    };
  }

  initialProgress(graph) {
    return {
      project: graph.project,
      started: new Date().toISOString(),
      currentPhase: 0,
      phases: graph.phases.map(p => ({
        id: p.id,
        name: p.name,
        status: p.id === 0 ? 'in_progress' : 'pending',
        tasks: p.tasks.length,
        completed: 0
      })),
      tasks: Object.fromEntries(graph.phases.flatMap(p => p.tasks.map(t => [t.id, { status: 'pending', deps: t.deps }]))),
      summary: {
        totalTasks: graph.phases.reduce((sum, p) => sum + p.tasks.length, 0),
        completed: 0,
        inProgress: 0,
        pending: graph.phases.reduce((sum, p) => sum + p.tasks.length, 0),
        failed: 0,
        blocked: 0
      }
    };
  }
}

export default ProjectOrchestrator;