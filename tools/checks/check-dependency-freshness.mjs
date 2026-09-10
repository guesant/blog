import { spawnSync } from 'node:child_process';

const pnpm = process.env.PORTFOLIO_PNPM_BIN ?? 'pnpm';
const result = spawnSync(pnpm, ['outdated', '--recursive', '--format', 'table'], {
  encoding: 'utf8',
});
if (result.stdout) {
  process.stdout.write(result.stdout);
}
if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.status !== 0 && result.status !== 1) {
  process.exit(result.status ?? 1);
}
