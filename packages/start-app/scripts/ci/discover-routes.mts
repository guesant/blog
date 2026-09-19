import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getCases,
  getExperiments,
  getLatestNotes,
  getProjects,
  getReferenceCollections,
  getReferences,
  getTopics,
} from '../../content-runtime/src/server.ts';

function optionValue(option: string): string | undefined {
  const index = process.argv.indexOf(option);
  return index === -1 ? undefined : process.argv[index + 1];
}

type Slugged = { slug: string };

const manifestPath = path.resolve(
  process.cwd(),
  optionValue('--output-file') ??
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'audited-routes.json'),
);

function firstRoute(items: Slugged[], prefix: string): string[] {
  const [first] = items;
  return first ? [`${prefix}/${first.slug}`] : [];
}

const [cases, projects, experiments, writings, references, topics, collections] = await Promise.all(
  [
    getCases(),
    getProjects(),
    getExperiments(),
    getLatestNotes(),
    getReferences(),
    getTopics(),
    getReferenceCollections(),
  ],
);

const [firstReference] = references;

const routes = [
  '/',
  '/about',
  '/cases',
  ...firstRoute(cases, '/cases'),
  '/projects',
  ...firstRoute(projects, '/projects'),
  ...firstRoute(experiments, '/projects/experiments'),
  '/resume',
  '/writing',
  ...firstRoute(writings, '/writing'),
  '/findings',
  ...firstRoute(references, '/findings'),
  ...(firstReference ? [`/findings/types/${firstReference.type}`] : []),
  '/topics',
  ...firstRoute(topics, '/topics'),
  '/colecoes',
  ...firstRoute(collections, '/colecoes'),
  '/contact',
];

await writeFile(manifestPath, `${JSON.stringify({ routes }, null, 2)}\n`, 'utf8');
