import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const routes = [
  '/',
  '/about',
  '/portfolio',
  '/now',
  '/cases',
  '/collections',
  '/contact',
  '/credits',
  '/findings',
  '/license',
  '/follow',
  '/projects',
  '/resume',
  '/snippets',
  '/status',
  '/technologies',
  '/topics',
  '/writing',
];

const outputPath = path.join(process.cwd(), 'audits', 'audited-routes.json');

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ routes }, null, 2)}\n`);
