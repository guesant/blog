import { fileURLToPath } from 'node:url';
import { parseGenerateCommandOptions } from './cli.ts';
import { loadProfileReadmeSource } from './content.ts';
import { generateProfileReadme } from './generate.ts';

const { outputPath } = parseGenerateCommandOptions(process.argv.slice(2));
const workspaceReadmePath = fileURLToPath(new URL('../../../../README.md', import.meta.url));

await generateProfileReadme({
  outputPath,
  workspaceReadmePath,
  source: await loadProfileReadmeSource(),
});
