import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const repositoryUrl = 'git+https://github.com/guesant/portfolio.git';
const repositoryWebUrl = 'https://github.com/guesant/portfolio';

function packageManifestPaths() {
  const files = execFileSync('git', ['ls-files', '--', 'package.json', '**/package.json'], {
    cwd: root,
    encoding: 'utf8',
  });
  return files
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((filename) => path.join(root, filename));
}

function readJson(filename) {
  return JSON.parse(readFileSync(filename, 'utf8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function checkProjectMetadata() {
  const manifest = readJson(path.join(root, 'package.json'));
  assert(manifest.private === true, 'The root package must remain private.');
  assert(manifest.license === 'MIT', 'The root package must declare the MIT license.');
  assert(manifest.packageManager.startsWith('pnpm@'), 'Pin pnpm with packageManager.');
  assert(
    manifest.engines?.node === '>=24.18.0 <25',
    'Pin the supported Node.js major in engines.node.',
  );
  assert(manifest.engines?.pnpm === '11.17.0', 'Pin the supported pnpm version in engines.pnpm.');
  assert(manifest.repository?.type === 'git', 'Declare the Git repository type.');
  assert(manifest.repository?.url === repositoryUrl, 'Declare the canonical Git repository URL.');
  assert(manifest.bugs?.url === `${repositoryWebUrl}/issues`, 'Declare the issue tracker URL.');
  assert(manifest.homepage === `${repositoryWebUrl}#readme`, 'Declare the project homepage.');

  const names = new Set();
  for (const filename of packageManifestPaths()) {
    const packageJson = readJson(filename);
    const relativePath = path.relative(root, filename);
    assert(packageJson.private === true, `${relativePath} must remain private.`);
    assert(packageJson.license === 'MIT', `${relativePath} must declare the MIT license.`);
    assert(
      typeof packageJson.name === 'string' && packageJson.name.length > 0,
      `${relativePath} needs a name.`,
    );
    assert(
      !names.has(packageJson.name),
      `${relativePath} duplicates package name ${packageJson.name}.`,
    );
    names.add(packageJson.name);
  }

  for (const filename of ['LICENSE', 'README.md', 'SECURITY.md', 'REUSE.toml']) {
    assert(
      existsSync(path.join(root, filename)),
      `Missing required project metadata: ${filename}.`,
    );
  }
}

if (import.meta.main) {
  checkProjectMetadata();
}
