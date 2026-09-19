import type { Page } from '@playwright/test';

export type ScriptAttribution = {
  sourceURL: string;
  sourceFunctionName: string;
  invoker: string;
  invokerType: string;
  duration: number;
  forcedStyleAndLayoutDuration: number;
};

export type LongAnimationFrame = {
  startTime: number;
  duration: number;
  blockingDuration: number;
  scripts: ScriptAttribution[];
};

export type InteractionTiming = {
  name: string;
  duration: number;
  inputDelay: number;
  processingTime: number;
};

export type CollectedPerformance = {
  longAnimationFrames: LongAnimationFrame[];
  interactions: InteractionTiming[];
  layoutShiftScore: number;
};

type RawEntry = Record<string, unknown>;

type RawLayoutShift = { value: number; hadRecentInput: boolean };

type RawCollection = {
  supported: boolean;
  longAnimationFrames: RawEntry[];
  interactions: RawEntry[];
  layoutShifts: RawLayoutShift[];
};

type PerformanceEntrySink = (entry: PerformanceEntry) => void;

type ObserverInit = PerformanceObserverInit & { durationThreshold?: number };

type LayoutShiftEntry = PerformanceEntry & RawLayoutShift;

declare global {
  interface Window {
    __renderProfile?: RawCollection;
    __renderProfileReset?: () => void;
  }
}

function browserCollector() {
  const supportedTypes = PerformanceObserver.supportedEntryTypes;

  const store: RawCollection = {
    supported: supportedTypes.includes('long-animation-frame'),
    longAnimationFrames: [],
    interactions: [],
    layoutShifts: [],
  };

  window.__renderProfile = store;
  window.__renderProfileReset = () => {
    store.longAnimationFrames.length = 0;
    store.interactions.length = 0;
    store.layoutShifts.length = 0;
  };

  const observe = (type: string, sink: PerformanceEntrySink, threshold?: number) => {
    if (!supportedTypes.includes(type)) {
      return;
    }
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        sink(entry);
      }
    });
    const init: ObserverInit = { type, buffered: true, durationThreshold: threshold };
    observer.observe(init);
  };

  const recordLayoutShift = (entry: PerformanceEntry) => {
    const shift = entry as LayoutShiftEntry;
    store.layoutShifts.push({ value: shift.value, hadRecentInput: shift.hadRecentInput });
  };

  observe('long-animation-frame', (entry) => store.longAnimationFrames.push(entry.toJSON()));
  observe('event', (entry) => store.interactions.push(entry.toJSON()), 16);
  observe('layout-shift', recordLayoutShift);
}

function toFiniteNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toScriptAttribution(raw: RawEntry): ScriptAttribution {
  return {
    sourceURL: toText(raw.sourceURL),
    sourceFunctionName: toText(raw.sourceFunctionName),
    invoker: toText(raw.invoker),
    invokerType: toText(raw.invokerType),
    duration: toFiniteNumber(raw.duration),
    forcedStyleAndLayoutDuration: toFiniteNumber(raw.forcedStyleAndLayoutDuration),
  };
}

function toLongAnimationFrame(raw: RawEntry): LongAnimationFrame {
  const scripts = Array.isArray(raw.scripts) ? (raw.scripts as RawEntry[]) : [];
  return {
    startTime: toFiniteNumber(raw.startTime),
    duration: toFiniteNumber(raw.duration),
    blockingDuration: toFiniteNumber(raw.blockingDuration),
    scripts: scripts.map(toScriptAttribution),
  };
}

function toInteractionTiming(raw: RawEntry): InteractionTiming {
  const startTime = toFiniteNumber(raw.startTime);
  const processingStart = toFiniteNumber(raw.processingStart);
  const processingEnd = toFiniteNumber(raw.processingEnd);
  return {
    name: toText(raw.name),
    duration: toFiniteNumber(raw.duration),
    inputDelay: processingStart - startTime,
    processingTime: processingEnd - processingStart,
  };
}

function isRealShift(shift: RawLayoutShift): boolean {
  return !shift.hadRecentInput;
}

export async function installPerformanceCollectors(page: Page): Promise<void> {
  await page.addInitScript(browserCollector);
}

export async function assertLongAnimationFramesSupported(page: Page): Promise<void> {
  const supported = await page.evaluate(() => window.__renderProfile?.supported === true);

  if (!supported) {
    throw new Error(
      'The Long Animation Frames API is unavailable in this browser. ' +
        'Render profiling requires Chromium >= 123, so pin a newer Chromium in ' +
        'the architecture-matched Playwright browser rather than degrading the measurement.',
    );
  }
}

export async function resetPerformanceCollectors(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.__renderProfileReset?.();
  });
}

export async function readPerformanceCollectors(page: Page): Promise<CollectedPerformance> {
  const raw = await page.evaluate(() => window.__renderProfile);
  const shifts = raw?.layoutShifts ?? [];

  return {
    longAnimationFrames: (raw?.longAnimationFrames ?? []).map(toLongAnimationFrame),
    interactions: (raw?.interactions ?? []).map(toInteractionTiming),
    layoutShiftScore: shifts
      .filter(isRealShift)
      .reduce((total, shift) => total + toFiniteNumber(shift.value), 0),
  };
}
