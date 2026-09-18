import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { BrowserContext, CDPSession, Page } from '@playwright/test';

export const CPU_THROTTLING_RATE = 4;

export type CounterSnapshot = Record<string, number>;

type ProfiledRun = () => Promise<void>;

export const GATED_COUNTERS = [
  'LayoutCount',
  'RecalcStyleCount',
  'Nodes',
  'JSEventListeners',
] as const;

export const ADVISORY_DURATIONS = [
  'LayoutDuration',
  'RecalcStyleDuration',
  'ScriptDuration',
  'TaskDuration',
] as const;

export async function openProfilingSession(
  context: BrowserContext,
  page: Page,
): Promise<CDPSession> {
  const session = await context.newCDPSession(page);
  await session.send('Performance.enable');
  await session.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLING_RATE });
  return session;
}

export async function readCounters(session: CDPSession): Promise<CounterSnapshot> {
  const { metrics } = await session.send('Performance.getMetrics');
  const snapshot: CounterSnapshot = {};
  for (const metric of metrics) {
    snapshot[metric.name] = metric.value;
  }
  return snapshot;
}

function deltaFor(
  names: readonly string[],
  before: CounterSnapshot,
  after: CounterSnapshot,
): CounterSnapshot {
  const delta: CounterSnapshot = {};
  for (const name of names) {
    delta[name] = (after[name] ?? 0) - (before[name] ?? 0);
  }
  return delta;
}

export function gatedDelta(before: CounterSnapshot, after: CounterSnapshot): CounterSnapshot {
  return deltaFor(GATED_COUNTERS, before, after);
}

export function advisoryDelta(before: CounterSnapshot, after: CounterSnapshot): CounterSnapshot {
  return deltaFor(ADVISORY_DURATIONS, before, after);
}

export async function captureCpuProfile(session: CDPSession, run: ProfiledRun): Promise<unknown> {
  await session.send('Profiler.enable');
  await session.send('Profiler.setSamplingInterval', { interval: 100 });
  await session.send('Profiler.start');
  await run();
  const { profile } = await session.send('Profiler.stop');
  await session.send('Profiler.disable');
  return profile;
}

export async function writeJsonArtifact(
  directory: string,
  fileName: string,
  payload: unknown,
): Promise<string> {
  await mkdir(directory, { recursive: true });
  const target = join(directory, fileName);
  await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return target;
}
