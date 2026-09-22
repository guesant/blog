const targetUrl = process.env.PUBLIC_SITE_URL ?? 'http://laravel:8000/api/v1/site/chrome?locale=en';
const sampleCount = Number(process.env.PUBLIC_SITE_RUNS ?? 20);
const concurrentCount = Number(process.env.PUBLIC_SITE_CONCURRENCY ?? 4);

async function readSample() {
  const startedAt = performance.now();
  const response = await fetch(targetUrl);
  await response.arrayBuffer();

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return {
    cache: response.headers.get('x-public-site-cache') ?? 'unknown',
    durationMs: performance.now() - startedAt,
  };
}

function percentile(samples, value) {
  const sorted = samples.toSorted((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * value) - 1);

  return sorted[index];
}

function summarize(samples) {
  const durations = samples.map((sample) => sample.durationMs);

  return {
    count: samples.length,
    p50Ms: percentile(durations, 0.5),
    p95Ms: percentile(durations, 0.95),
    cacheStates: Object.groupBy(samples, (sample) => sample.cache),
  };
}

const first = await readSample();
const sequential = await Promise.all(Array.from({ length: sampleCount }, readSample));
const concurrent = await Promise.all(Array.from({ length: concurrentCount }, readSample));

process.stdout.write(
  `${JSON.stringify({ targetUrl, first, sequential: summarize(sequential), concurrent: summarize(concurrent) }, null, 2)}\n`,
);
