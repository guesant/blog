import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const qlty = process.env.PORTFOLIO_QLTY_BIN ?? 'qlty';

if (!existsSync('.git')) {
  const initialization = spawnSync('/usr/bin/git', ['init', '--quiet'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  if (initialization.status !== 0) {
    process.stderr.write(initialization.stderr);
    throw new Error('Could not initialize the isolated Git metadata required by Qlty.');
  }
}

const execution = spawnSync(
  qlty,
  ['--no-upgrade-check', 'smells', '--all', '--no-duplication', '--sarif'],
  {
    cwd: process.cwd(),
    encoding: 'utf8',
  },
);

if (execution.error) {
  console.error(`Qlty could not start: ${execution.error.message}`);
  process.exit(1);
}

if (execution.status !== 0) {
  process.stderr.write(execution.stderr);
  process.stdout.write(execution.stdout);
  process.exit(execution.status ?? 1);
}

let report;
try {
  report = JSON.parse(execution.stdout);
} catch {
  process.stderr.write(execution.stderr);
  console.error('Qlty returned invalid SARIF output.');
  process.exit(1);
}

const findings = report.runs.flatMap((run) => run.results ?? []);
for (const finding of findings) {
  const location = finding.locations?.[0]?.physicalLocation;
  const filename = location?.artifactLocation?.uri ?? 'unknown';
  const line = location?.region?.startLine ?? 1;
  const message = finding.message?.text ?? 'Code smell detected';
  console.error(`${filename}:${line} ${finding.ruleId ?? 'qlty'} ${message}`);
}

if (findings.length > 0) {
  console.error(`Qlty found ${findings.length} blocking code smell(s).`);
  process.exit(1);
}

console.log('Qlty found no blocking code smells.');
