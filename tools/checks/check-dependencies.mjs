import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function overridesFrom(filename) {
  const source = readFileSync(filename, 'utf8');
  const section = source.match(/^overrides:\n([\s\S]*?)(?=^\S|$(?![\s\S]))/m)?.[1] ?? '';
  return new Map(
    [...section.matchAll(/^(?! {2}#) {2}(?:'([^']+)'|([^:]+)):\s*([^\s#]+)\s*(?:#.*)?$/gm)].map(
      ([, quoted, plain, version]) => [quoted ?? plain.trim(), version],
    ),
  );
}

function writeCommandOutput(result) {
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
}

function run(args) {
  const pnpm = process.env.PORTFOLIO_PNPM_BIN ?? 'pnpm';
  const result = spawnSync(pnpm, args, { encoding: 'utf8' });
  writeCommandOutput(result);
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  return result;
}

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

const workspaceOverrides = overridesFrom('pnpm-workspace.yaml');
const lockfileOverrides = overridesFrom('pnpm-lock.yaml');
const sameOverrides =
  workspaceOverrides.size === lockfileOverrides.size &&
  [...workspaceOverrides].every(
    ([selector, version]) => lockfileOverrides.get(selector) === version,
  );
if (!sameOverrides) {
  console.error('pnpm-lock.yaml overrides do not match pnpm-workspace.yaml.');
  process.exit(1);
}

console.log(`Auditing ${workspaceOverrides.size} pnpm overrides with pnpm why...`);
const packages = new Map(
  [...workspaceOverrides].map(([selector, version]) => {
    const dependency = selector.split('>').at(-1);
    const versionSeparator = dependency.lastIndexOf('@');
    const packageName =
      versionSeparator > dependency.indexOf('/')
        ? dependency.slice(0, versionSeparator)
        : dependency;
    return [packageName, version];
  }),
);
for (const [dependency, version] of packages) {
  console.log(`\n### pnpm why ${dependency}`);
  const result = run(['why', '--color=false', '--recursive', dependency]);
  const resolvedVersion = new RegExp(
    `(^|\\n)${escapeRegularExpression(dependency)}@${escapeRegularExpression(version)}(?:\\s|$)`,
    'u',
  );
  if (!resolvedVersion.test(result.stdout)) {
    console.error(
      `Override ${dependency}@${version} is not present in the resolved dependency graph.`,
    );
    process.exit(1);
  }
}
