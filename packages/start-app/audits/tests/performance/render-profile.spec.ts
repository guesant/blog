import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { type CDPSession, expect, type Page, test } from '@playwright/test';
import { type PerformanceFlow, performanceFlows } from './flows';
import {
  assertLongAnimationFramesSupported,
  type CollectedPerformance,
  type InteractionTiming,
  installPerformanceCollectors,
  type LongAnimationFrame,
  readPerformanceCollectors,
  resetPerformanceCollectors,
  type ScriptAttribution,
} from './instrumentation';
import {
  advisoryDelta,
  type CounterSnapshot,
  CPU_THROTTLING_RATE,
  captureCpuProfile,
  gatedDelta,
  openProfilingSession,
  readCounters,
  writeJsonArtifact,
} from './metrics';

const REPETITIONS = 5;

const RELATIVE_TOLERANCE = 1.1;

const ARTIFACT_DIRECTORY = join(process.cwd(), 'performance-results');
const BASELINE_PATH = join(process.cwd(), 'tests/performance/baseline.json');

const isUpdatingBaseline = process.env.UPDATE_PERF_BASELINE === '1';

type FlowBudget = {
  maxLongFrames: number;
  maxForcedLayoutFrames: number;
  recalcStyleCount: number;
  layoutCount: number;
};

type Baseline = {
  cpuThrottlingRate: number;
  flows: Record<string, FlowBudget>;
};

type Violation = { metric: string; measured: number; allowed: number };

type CounterPicker = (sample: Sample) => CounterSnapshot;

type Sample = {
  longFrames: number;
  forcedLayoutFrames: number;
  maxBlockingDuration: number;
  layoutShiftScore: number;
  counters: CounterSnapshot;
  advisory: CounterSnapshot;
  scripts: ScriptAttribution[];
  interactions: InteractionTiming[];
};

const measurements: Record<string, unknown> = {};
const recordedBudgets: Record<string, FlowBudget> = {};

function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((first, second) => first - second);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[middle];
  }
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function hasForcedLayout(frame: LongAnimationFrame): boolean {
  return frame.scripts.some((script) => script.forcedStyleAndLayoutDuration > 0);
}

function toSample(
  collected: CollectedPerformance,
  counters: CounterSnapshot,
  advisory: CounterSnapshot,
): Sample {
  const frames = collected.longAnimationFrames;
  return {
    longFrames: frames.length,
    forcedLayoutFrames: frames.filter(hasForcedLayout).length,
    maxBlockingDuration: Math.max(0, ...frames.map((frame) => frame.blockingDuration)),
    layoutShiftScore: collected.layoutShiftScore,
    counters,
    advisory,
    scripts: frames.flatMap((frame) => frame.scripts),
    interactions: collected.interactions,
  };
}

function contributorKey(script: ScriptAttribution): string {
  const fn = script.sourceFunctionName || 'anonymous';
  const source = script.sourceURL || 'inline';
  return `${fn} @ ${source}`;
}

function topContributors(samples: Sample[]) {
  const totals = new Map<
    string,
    { duration: number; forcedStyleAndLayout: number; hits: number }
  >();

  for (const sample of samples) {
    for (const script of sample.scripts) {
      const key = contributorKey(script);
      const entry = totals.get(key) ?? { duration: 0, forcedStyleAndLayout: 0, hits: 0 };
      entry.duration += script.duration;
      entry.forcedStyleAndLayout += script.forcedStyleAndLayoutDuration;
      entry.hits += 1;
      totals.set(key, entry);
    }
  }

  return [...totals.entries()]
    .map(([name, value]) => ({ name, ...value }))
    .sort((first, second) => second.duration - first.duration)
    .slice(0, 5);
}

function medianCounters(samples: Sample[], pick: CounterPicker): CounterSnapshot {
  const names = new Set(samples.flatMap((sample) => Object.keys(pick(sample))));
  const result: CounterSnapshot = {};
  for (const name of names) {
    result[name] = median(samples.map((sample) => pick(sample)[name] ?? 0));
  }
  return result;
}

function slowestInteraction(samples: Sample[]): InteractionTiming | null {
  return samples
    .flatMap((sample) => sample.interactions)
    .reduce<InteractionTiming | null>(
      (worst, candidate) => (worst && worst.duration >= candidate.duration ? worst : candidate),
      null,
    );
}

function summarize(flow: PerformanceFlow, samples: Sample[]) {
  return {
    flow: flow.name,
    purpose: flow.purpose,
    repetitions: samples.length,
    cpuThrottlingRate: CPU_THROTTLING_RATE,
    gated: {
      longFrames: Math.round(median(samples.map((sample) => sample.longFrames))),
      forcedLayoutFrames: Math.round(median(samples.map((sample) => sample.forcedLayoutFrames))),
      counters: medianCounters(samples, (sample) => sample.counters),
    },
    advisory: {
      maxBlockingDuration: median(samples.map((sample) => sample.maxBlockingDuration)),
      layoutShiftScore: median(samples.map((sample) => sample.layoutShiftScore)),
      durations: medianCounters(samples, (sample) => sample.advisory),
      slowestInteraction: slowestInteraction(samples),
      topContributors: topContributors(samples),
    },
  };
}

function toBudget(summary: ReturnType<typeof summarize>): FlowBudget {
  return {
    maxLongFrames: summary.gated.longFrames,
    maxForcedLayoutFrames: summary.gated.forcedLayoutFrames,
    recalcStyleCount: Math.round(summary.gated.counters.RecalcStyleCount ?? 0),
    layoutCount: Math.round(summary.gated.counters.LayoutCount ?? 0),
  };
}

function findViolations(actual: FlowBudget, budget: FlowBudget): Violation[] {
  const violations: Violation[] = [];
  for (const metric of Object.keys(budget) as (keyof FlowBudget)[]) {
    const allowed = Math.max(Math.ceil(budget[metric] * RELATIVE_TOLERANCE), budget[metric] + 1);
    if (actual[metric] > allowed) {
      violations.push({ metric, measured: actual[metric], allowed });
    }
  }
  return violations;
}

async function loadBaseline(): Promise<Baseline> {
  try {
    return JSON.parse(await readFile(BASELINE_PATH, 'utf8')) as Baseline;
  } catch {
    if (isUpdatingBaseline) {
      return { cpuThrottlingRate: CPU_THROTTLING_RATE, flows: {} };
    }
    throw new Error(
      `No baseline at ${BASELINE_PATH}. Generate one with UPDATE_PERF_BASELINE=1 and commit it.`,
    );
  }
}

async function recordDiagnosticProfile(
  session: CDPSession,
  flow: PerformanceFlow,
  page: Page,
): Promise<void> {
  const profile = await captureCpuProfile(session, async () => {
    await flow.prepare(page);
    await flow.interact(page);
  });
  await writeJsonArtifact(ARTIFACT_DIRECTORY, `${flow.name}.cpuprofile`, profile);
}

for (const flow of performanceFlows) {
  test(`${flow.name} stays within its render budget`, async ({ page, context }) => {
    if (flow.viewport) {
      await page.setViewportSize(flow.viewport);
    }

    await installPerformanceCollectors(page);
    const session = await openProfilingSession(context, page);

    const samples: Sample[] = [];
    for (let run = 0; run < REPETITIONS; run += 1) {
      await flow.prepare(page);
      await assertLongAnimationFramesSupported(page);
      await resetPerformanceCollectors(page);

      const before = await readCounters(session);
      await flow.interact(page);
      const after = await readCounters(session);

      const collected = await readPerformanceCollectors(page);
      samples.push(toSample(collected, gatedDelta(before, after), advisoryDelta(before, after)));
    }

    const summary = summarize(flow, samples);
    const actual = toBudget(summary);
    measurements[flow.name] = summary;
    recordedBudgets[flow.name] = actual;

    const baseline = await loadBaseline();
    const budget = baseline.flows[flow.name];
    const violations = isUpdatingBaseline || !budget ? [] : findViolations(actual, budget);

    if (violations.length > 0) {
      await recordDiagnosticProfile(session, flow, page);
    }

    expect(
      violations,
      `${flow.name} exceeded its render budget. ${flow.purpose} ` +
        `Top contributors: ${JSON.stringify(summary.advisory.topContributors)}`,
    ).toEqual([]);
  });
}

test.afterAll(async () => {
  await writeJsonArtifact(ARTIFACT_DIRECTORY, 'performance-summary.json', {
    cpuThrottlingRate: CPU_THROTTLING_RATE,
    repetitions: REPETITIONS,
    flows: measurements,
  });

  if (!isUpdatingBaseline) {
    return;
  }

  const existing = await loadBaseline();
  await writeJsonArtifact(process.cwd(), 'tests/performance/baseline.json', {
    cpuThrottlingRate: CPU_THROTTLING_RATE,
    flows: { ...existing.flows, ...recordedBudgets },
  });
});
