import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MiniSearch from 'minisearch';
import { runRegenerationCli } from '../../content-runtime/src/regeneration.ts';
import { createSearchRuntime, type SearchReference } from './search-runtime.ts';

function optionValue(option: string) {
  const index = process.argv.indexOf(option);
  return index === -1 ? undefined : process.argv[index + 1];
}

const contentDir = fileURLToPath(new URL('../../content-runtime/content/cms/', import.meta.url));
const publicDir = path.resolve(process.cwd(), optionValue('--output-dir') ?? 'public');
const searchRuntime = createSearchRuntime(contentDir);

type SearchDocument = {
  id: string;
  slug: string;
  title: string;
  alternativeTitle: string;
  description: string;
  reasonFound: string;
  authors: string;
  organizations: string;
  topics: string;
  collections: string;
  type: string;
  language: string;
  platform: string;
  identifiers: string;
  relatedTitles: string;
  topicSlugs: string[];
  consumptionState: string;
  rating: string;
  year: string;
  hasFreeLinks: boolean;
  hasPaidLinks: boolean;
};

export const searchIndexFields: (keyof SearchDocument)[] = [
  'title',
  'alternativeTitle',
  'description',
  'reasonFound',
  'authors',
  'organizations',
  'topics',
  'collections',
  'type',
  'language',
  'platform',
  'identifiers',
  'relatedTitles',
];

export const searchIndexStoreFields: (keyof SearchDocument)[] = [
  'slug',
  'title',
  'type',
  'topicSlugs',
  'consumptionState',
  'rating',
  'language',
  'year',
  'hasFreeLinks',
  'hasPaidLinks',
];

type CollectionReferencePair = [referenceSlug: string, collectionTitle: string];

function collectionReferencePairs(
  detail: Awaited<ReturnType<typeof searchRuntime.getReferenceCollectionBySlug>>,
): CollectionReferencePair[] {
  if (!detail) {
    return [];
  }
  return detail.items.map((item) => [item.reference.slug, detail.title]);
}

function groupTitlesBySlug(pairs: CollectionReferencePair[]): Map<string, string[]> {
  const titlesBySlug = new Map<string, string[]>();
  for (const [slug, title] of pairs) {
    titlesBySlug.set(slug, [...(titlesBySlug.get(slug) ?? []), title]);
  }
  return titlesBySlug;
}

type Locale = 'en' | 'pt-BR';

async function collectionTitlesByReferenceSlug(locale: Locale): Promise<Map<string, string[]>> {
  const collections = await searchRuntime.getReferenceCollections(locale);
  const details = await Promise.all(
    collections.map((collection) =>
      searchRuntime.getReferenceCollectionBySlug(collection.slug, locale),
    ),
  );
  return groupTitlesBySlug(details.flatMap(collectionReferencePairs));
}

function joinPlatforms(reference: SearchReference): string {
  return reference.links
    .map((link) => link.platform)
    .filter(Boolean)
    .join(' ');
}

function joinIdentifierValues(reference: SearchReference): string {
  return reference.identifiers.map((identifier) => identifier.value).join(' ');
}

function joinRelatedTitles(reference: SearchReference): string {
  return reference.relations.map((relation) => relation.targetTitle).join(' ');
}

function hasFreeLink(reference: SearchReference): boolean {
  return reference.links.some((link) => link.isFree === true);
}

function hasPaidLink(reference: SearchReference): boolean {
  return reference.links.some((link) => link.isPaid === true);
}

function orEmpty(value: string | undefined): string {
  return value ?? '';
}

function publicationYear(reference: SearchReference): string {
  return reference.publishedDateISO?.slice(0, 4) ?? '';
}

function textFields(reference: SearchReference, collectionTitles: string[]) {
  return {
    title: reference.title,
    alternativeTitle: orEmpty(reference.alternativeTitle),
    description: reference.description,
    reasonFound: orEmpty(reference.reasonFound),
    authors: orEmpty(reference.authors),
    organizations: orEmpty(reference.organizations),
    topics: reference.topics.join(' '),
    collections: collectionTitles.join(' '),
    type: reference.type,
    language: orEmpty(reference.language),
    platform: joinPlatforms(reference),
    identifiers: joinIdentifierValues(reference),
    relatedTitles: joinRelatedTitles(reference),
  };
}

function facetFields(reference: SearchReference) {
  return {
    topicSlugs: reference.topicSlugs ?? [],
    consumptionState: orEmpty(reference.consumptionState),
    rating: orEmpty(reference.rating),
    year: publicationYear(reference),
    hasFreeLinks: hasFreeLink(reference),
    hasPaidLinks: hasPaidLink(reference),
  };
}

function toSearchDocument(reference: SearchReference, collectionTitles: string[]): SearchDocument {
  return {
    id: reference.slug,
    slug: reference.slug,
    ...textFields(reference, collectionTitles),
    ...facetFields(reference),
  };
}

async function buildSearchDocuments(locale: Locale): Promise<SearchDocument[]> {
  const [references, collectionTitles] = await Promise.all([
    searchRuntime.getReferences(locale),
    collectionTitlesByReferenceSlug(locale),
  ]);

  const detailed = await Promise.all(
    references.map((reference) => searchRuntime.getReference(reference.slug, locale)),
  );

  return detailed.flatMap((reference) =>
    reference ? [toSearchDocument(reference, collectionTitles.get(reference.slug) ?? [])] : [],
  );
}

function buildIndex(documents: SearchDocument[]): MiniSearch<SearchDocument> {
  const miniSearch = new MiniSearch<SearchDocument>({
    idField: 'id',
    fields: searchIndexFields as string[],
    storeFields: searchIndexStoreFields as string[],
  });
  miniSearch.addAll(documents);
  return miniSearch;
}

const locales: Locale[] = ['en', 'pt-BR'];

function selectedLocales(): Locale[] {
  const requestedLocale = optionValue('--locale');
  if (!requestedLocale) {
    return locales;
  }
  if (requestedLocale !== 'en' && requestedLocale !== 'pt-BR') {
    throw new Error(`Unsupported search-index locale: ${requestedLocale}`);
  }
  return [requestedLocale];
}

async function generateForLocale(locale: Locale): Promise<void> {
  const documents = await buildSearchDocuments(locale);
  const index = buildIndex(documents);
  const outputFile = path.join(publicDir, `achados-search-index.${locale}.json`);
  await writeFile(outputFile, JSON.stringify(index), 'utf8');
  process.stdout.write(
    `Generated public/achados-search-index.${locale}.json (${documents.length} references)\n`,
  );
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  await Promise.all(selectedLocales().map(generateForLocale));
}

runRegenerationCli({
  moduleUrl: import.meta.url,
  directories: [contentDir],
  regenerate: main,
  watchMessage: 'Watching Achados content for search index changes...',
  failureMessage: 'Achados search index regeneration failed:',
});
