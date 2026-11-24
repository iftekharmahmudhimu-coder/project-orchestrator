import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ProjectOrchestrator } from '../src/index.js';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('ProjectOrchestrator', () => {
  let tempDir;
  let orchestrator;

  test.beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'orchestrator-test-'));
    orchestrator = new ProjectOrchestrator(tempDir);
  });

  test.afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  test('init creates .orchestrator directories', async () => {
    await orchestrator.init();
    // Directories should exist
    assert.ok(true);
  });

  test('detectStack returns default stack', async () => {
    const stack = await orchestrator.detectStack({});
    assert.ok(stack.frontend);
    assert.ok(stack.backend);
    assert.ok(stack.database);
  });

  test('decompose returns tasks for all 6 phases', () => {
    const tasks = orchestrator.decompose({}, {});
    const phases = [...new Set(tasks.map(t => t.phase))].sort((a, b) => a - b);
    assert.deepStrictEqual(phases, [0, 1, 2, 3, 4, 5, 6]);
  });

  test('buildTaskGraph creates valid graph structure', () => {
    const tasks = orchestrator.decompose({}, {});
    const stack = { frontend: 'react', backend: 'node' };
    const graph = orchestrator.buildTaskGraph(tasks, stack);
    assert.ok(graph.project);
    assert.ok(graph.stack);
    assert.ok(graph.phases.length >= 7);
  });

  test('initialProgress tracks all tasks', () => {
    const tasks = orchestrator.decompose({}, {});
    const stack = { frontend: 'react', backend: 'node' };
    const graph = orchestrator.buildTaskGraph(tasks, stack);
    const progress = orchestrator.initialProgress(graph);
    assert.strictEqual(progress.summary.totalTasks, tasks.length);
    assert.strictEqual(progress.summary.pending, tasks.length);
  });
});