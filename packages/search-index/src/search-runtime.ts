import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

type Locale = 'en' | 'pt-BR';
type TranslationKey = 'en' | 'ptBR';
type JsonRecord = Record<string, unknown>;
type Translation = JsonRecord & {
  description?: string;
  name?: string;
  reasonFound?: string;
  title?: string;
};
type RawRelation = JsonRecord & { target?: unknown };
type RawCollectionItem = JsonRecord & { item?: unknown; note?: string };
type RawDocument = JsonRecord & {
  code?: string;
  identifiers?: JsonRecord[];
  items?: RawCollectionItem[];
  language?: unknown;
  links?: JsonRecord[];
  relations?: RawRelation[];
  slug?: string;
  topics?: unknown[];
  translations?: Partial<Record<TranslationKey, Translation>>;
  visibility?: string;
};
type SearchLink = JsonRecord & { isFree?: boolean; isPaid?: boolean; platform?: string };
type SearchIdentifier = JsonRecord & { value?: string };
type SearchRelation = JsonRecord & { targetTitle: string };

export type SearchReference = JsonRecord & {
  alternativeTitle?: string;
  authors?: string;
  consumptionState?: string;
  slug: string;
  title: string;
  description: string;
  reasonFound?: string;
  organizations?: string;
  publishedDateISO?: string;
  rating?: string;
  topics: string[];
  topicSlugs: string[];
  language: string;
  links: SearchLink[];
  identifiers: SearchIdentifier[];
  relations: SearchRelation[];
  type: string;
};

type SearchCollection = JsonRecord & {
  slug: string;
  title: string;
  items: Array<{ reference: SearchReference; note?: string }>;
};

function translationKey(locale?: string): TranslationKey {
  return locale === 'pt-BR' ? 'ptBR' : 'en';
}

function referenceSlug(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  return value
    .split('/')
    .at(-1)
    ?.replace(/\.json$/u, '');
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function stripHidden(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.filter((item) => !(isRecord(item) && item.hidden === true)).map(stripHidden);
  }
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, stripHidden(item)]));
  }
  return value;
}

function referencePath(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (isRecord(value) && 'item' in value) {
    return referencePath(value.item);
  }
  return undefined;
}

async function readJson(filename: string): Promise<RawDocument> {
  return JSON.parse(await readFile(filename, 'utf8')) as RawDocument;
}

async function readDirectory(directory: string): Promise<RawDocument[]> {
  const filenames = (await readdir(directory))
    .filter((filename) => filename.endsWith('.json'))
    .sort();
  return Promise.all(filenames.map((filename) => readJson(path.join(directory, filename))));
}

function localizedDocument(raw: RawDocument, locale: Locale): JsonRecord {
  const { translations, ...shared } = raw;
  const localized = translations?.[translationKey(locale)];
  const document = stripHidden({ ...shared, ...(localized ?? {}) });
  return isRecord(document) ? document : {};
}

function normalizeLocale(locale?: string): Locale {
  return locale === 'pt-BR' ? 'pt-BR' : 'en';
}

function publicRelationTarget(
  relation: RawRelation,
  graph: Map<string, RawDocument>,
): { slug: string; document: RawDocument } | undefined {
  const targetSlug = referenceSlug(referencePath(relation.target));
  if (!targetSlug) {
    return undefined;
  }
  const target = graph.get(targetSlug);
  if (target?.visibility !== 'public') {
    return undefined;
  }
  return { slug: targetSlug, document: target };
}

function localizedRelation(
  relation: RawRelation,
  graph: Map<string, RawDocument>,
  locale: Locale,
): SearchRelation | undefined {
  const target = publicRelationTarget(relation, graph);
  if (!target) {
    return undefined;
  }
  return {
    ...relation,
    targetSlug: target.slug,
    targetTitle: target.document.translations?.[translationKey(locale)]?.title ?? target.slug,
  };
}

function localizedRelations(
  raw: RawDocument,
  graph: Map<string, RawDocument>,
  locale: Locale,
): SearchRelation[] {
  const relations = Array.isArray(raw.relations) ? raw.relations : [];
  return relations.flatMap((relation) => {
    const localized = localizedRelation(relation, graph, locale);
    return localized ? [localized] : [];
  });
}

function topicSlugs(topics: unknown[]): string[] {
  return topics.flatMap((topic) => {
    const slug = referenceSlug(referencePath(topic));
    return slug ? [slug] : [];
  });
}

class FileSearchRuntime {
  private readonly contentRoot: string;
  private referencesPromise: Promise<Map<string, RawDocument>> | undefined;
  private entitiesPromise: Promise<Map<string, RawDocument>> | undefined;

  constructor(contentRoot: string) {
    this.contentRoot = contentRoot;
  }

  private async referenceGraph(): Promise<Map<string, RawDocument>> {
    this.referencesPromise ??= (async () => {
      const documents = await readDirectory(path.join(this.contentRoot, 'references'));
      return new Map(
        documents.flatMap((document) =>
          typeof document.slug === 'string' ? [[document.slug, document] as const] : [],
        ),
      );
    })();
    return this.referencesPromise;
  }

  private async entityIndex(): Promise<Map<string, RawDocument>> {
    this.entitiesPromise ??= (async () => {
      const collections = ['languages', 'topics'];
      const entries = await Promise.all(
        collections.map(async (collection) => {
          const documents = await readDirectory(path.join(this.contentRoot, collection));
          return documents.flatMap((document) =>
            typeof document.slug === 'string'
              ? [[`${collection}/${document.slug}`, document] as const]
              : [],
          );
        }),
      );
      return new Map(entries.flat());
    })();
    return this.entitiesPromise;
  }

  private async entityName(value: unknown, locale: Locale, collection: 'languages' | 'topics') {
    const slug = referenceSlug(referencePath(value));
    if (!slug) {
      return '';
    }
    const document = (await this.entityIndex()).get(`${collection}/${slug}`);
    return document?.translations?.[translationKey(locale)]?.name ?? document?.code ?? slug;
  }

  async getReference(slug: string, locale: Locale): Promise<SearchReference | undefined> {
    const graph = await this.referenceGraph();
    const raw = graph.get(slug);
    if (raw?.visibility !== 'public') {
      return undefined;
    }

    const localized = localizedDocument(raw, locale);
    const topics = Array.isArray(raw.topics) ? raw.topics : [];

    return {
      ...localized,
      topics: await Promise.all(topics.map((topic) => this.entityName(topic, locale, 'topics'))),
      topicSlugs: topicSlugs(topics),
      language: await this.entityName(raw.language, locale, 'languages'),
      links: Array.isArray(raw.links) ? raw.links : [],
      identifiers: Array.isArray(raw.identifiers) ? raw.identifiers : [],
      relations: localizedRelations(raw, graph, locale),
    } as SearchReference;
  }

  async getReferences(locale?: string): Promise<SearchReference[]> {
    const documents = [...(await this.referenceGraph()).values()];
    const resolvedLocale = normalizeLocale(locale);
    const references = await Promise.all(
      documents
        .filter((document) => document.visibility === 'public' && typeof document.slug === 'string')
        .map((document) => this.getReference(document.slug as string, resolvedLocale)),
    );
    return references.filter((reference): reference is SearchReference => Boolean(reference));
  }

  private async resolveCollectionItem(item: RawCollectionItem, locale: Locale) {
    const slug = referenceSlug(referencePath(item.item));
    const reference = slug ? await this.getReference(slug, locale) : undefined;
    return reference ? { reference, note: item.note } : undefined;
  }

  private async localizeCollection(raw: RawDocument, locale: Locale): Promise<SearchCollection> {
    const localized = localizedDocument(raw, locale);
    const items = Array.isArray(raw.items) ? raw.items : [];
    const references = await Promise.all(
      items.map((item) => this.resolveCollectionItem(item, locale)),
    );
    return {
      ...localized,
      items: references.flatMap((item) => (item ? [item] : [])),
    } as SearchCollection;
  }

  async getReferenceCollections(locale?: string): Promise<SearchCollection[]> {
    const resolvedLocale = normalizeLocale(locale);
    const documents = await readDirectory(path.join(this.contentRoot, 'collections'));
    return Promise.all(documents.map((raw) => this.localizeCollection(raw, resolvedLocale)));
  }

  async getReferenceCollectionBySlug(slug: string, locale?: string) {
    return (await this.getReferenceCollections(locale)).find(
      (collection) => collection.slug === slug,
    );
  }
}

export function createSearchRuntime(contentRoot: string) {
  return new FileSearchRuntime(contentRoot);
}
