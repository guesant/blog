import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMDX } from '@tinacms/mdx';
import { isHidden, withoutHiddenItems } from '../../domain/content-visibility.ts';
import { createEmailChallenge } from '../../domain/protected-email/create.server.ts';
import type { ProtectedEmailChallenge } from '../../domain/protected-email/types.ts';
import { type RelationTypeId, relationTypes } from '../../domain/relation-types.ts';
import type {
  CreditsContent,
  InterfaceMessages,
  Profile,
  ResumeContent,
  SiteText,
  TechnologyBadge,
} from '../../domain/types.ts';
import { createTinaPayload, type TinaQueryName } from './editor-payload.ts';

export { withoutHiddenItems } from '../../domain/content-visibility.ts';

export type ContentLocale = 'en' | 'pt-BR';
export type ContentCollection =
  | 'cases'
  | 'projects'
  | 'experiments'
  | 'writing'
  | 'references'
  | 'collections'
  | 'topics';
type EntityCollection = 'technologies' | 'languages' | 'categories' | 'tags' | 'topics';

type TranslationKey = 'en' | 'ptBR';
type FieldLocalizedDocument<T> = Record<string, unknown> & {
  translations: Record<TranslationKey, T>;
};

function findWorkspaceContentRoot(directory: string): string {
  const candidate = path.join(directory, 'packages', 'content', 'content', 'cms');
  if (existsSync(candidate)) {
    return candidate;
  }
  const parent = path.dirname(directory);
  return parent === directory ? candidate : findWorkspaceContentRoot(parent);
}

function findContentRoot(): string {
  const configuredRoot = process.env.PORTFOLIO_CONTENT_ROOT;
  if (configuredRoot) {
    const configuredCandidates = [
      configuredRoot,
      ...(process.env.JS_BINARY__EXECROOT
        ? [path.resolve(process.env.JS_BINARY__EXECROOT, configuredRoot)]
        : []),
    ];
    const existingRoot = configuredCandidates.find((candidate) => existsSync(candidate));
    if (existingRoot) {
      return existingRoot;
    }
  }

  const packageContentRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../content/cms',
  );
  if (existsSync(packageContentRoot)) {
    return packageContentRoot;
  }

  const directCandidate = path.join(process.cwd(), 'content', 'cms');
  if (existsSync(directCandidate)) {
    return directCandidate;
  }
  return findWorkspaceContentRoot(process.cwd());
}

const contentRoot = findContentRoot();

export function normalizeLocale(locale?: string): ContentLocale {
  return locale === 'pt-BR' ? 'pt-BR' : 'en';
}

function getTranslationKey(locale?: string): TranslationKey {
  return normalizeLocale(locale) === 'pt-BR' ? 'ptBR' : 'en';
}

function isSafeSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

const arrayFieldsByRoot: Partial<Record<TinaQueryName, string[]>> = {
  caseStudy: ['technologies', 'metrics'],
  project: ['technologies', 'metrics'],
  experiment: ['technologies'],
  writing: ['tags'],
  profile: ['personalInterests', 'trajectory', 'milestones'],
  resume: [
    'selectedCases',
    'skills',
    'languages',
    'leadership',
    'education',
    'certificates',
    'certifications',
    'publications',
    'recommendations',
    'technicalProductions',
    'events',
    'awards',
  ],
  homePage: ['featuredCases', 'featuredProjects', 'featuredWriting'],
  credits: ['entries'],
  resource: ['topics', 'links', 'identifiers', 'relations'],
  referenceCollection: ['items'],
  topic: ['relations'],
};

const richTextFieldsByRoot: Partial<Record<TinaQueryName, string[]>> = {
  caseStudy: ['body'],
  project: ['body'],
  experiment: ['body'],
  writing: ['body'],
  aboutPage: ['story'],
  referenceCollection: ['intro'],
};

const richTextField: Parameters<typeof parseMDX>[1] = { name: 'body', type: 'rich-text' };
const passthroughImage = (url: string) => url;

function parseRichText(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }
  return parseMDX(value, richTextField, passthroughImage);
}

function withParsedRichText<T>(
  document: FieldLocalizedDocument<T>,
  root: TinaQueryName,
): FieldLocalizedDocument<T> {
  const fields = richTextFieldsByRoot[root];
  if (!fields) {
    return document;
  }

  const parseTranslation = (translation: unknown) => {
    if (!translation || typeof translation !== 'object') {
      return translation;
    }
    const next = { ...(translation as Record<string, unknown>) };
    for (const field of fields) {
      next[field] = parseRichText(next[field]);
    }
    return next;
  };

  return {
    ...document,
    translations: {
      en: parseTranslation(document.translations.en),
      ptBR: parseTranslation(document.translations.ptBR),
    },
  } as FieldLocalizedDocument<T>;
}

function withoutProtectedFields<T>(
  document: FieldLocalizedDocument<T>,
  root: TinaQueryName,
): FieldLocalizedDocument<T> {
  const contact = root === 'settings' ? asRecord(document.contact) : undefined;
  if (!contact) {
    return document;
  }
  return {
    ...document,
    contact: { profiles: contact.profiles, available: contact.available },
  };
}

async function withoutPrivateRelations<T>(
  document: FieldLocalizedDocument<T>,
  root: TinaQueryName,
): Promise<FieldLocalizedDocument<T>> {
  const relations = root === 'resource' ? (document as UnknownRecord).relations : undefined;
  if (!Array.isArray(relations)) {
    return document;
  }
  const graph = await getReferenceGraph();
  const filtered = relations.filter((entry) => {
    const relation = asRecord(entry) as RawRelation | undefined;
    const targetSlug = relation ? referenceSlug(referencePath(relation.target)) : undefined;
    return targetSlug ? isPublicRawReference(graph.get(targetSlug)) : false;
  });
  return { ...document, relations: filtered };
}

type EntityDocument = {
  slug?: string;
  order?: number;
  translations?: Record<TranslationKey, { name?: string }>;
  code?: string;
  logo?: string;
};
type EntityReference = string | Record<string, unknown>;
type SharedFields = Record<string, unknown>;
type ResumeSkillReference = { category?: unknown; technologies?: unknown };
type ResumeLanguageReference = { language?: unknown; proficiency?: string };
type CreditReference = {
  url?: string;
  category?: string;
  translations?: Record<TranslationKey, { name?: string; description?: string }>;
};
type UnknownRecord = Record<string, unknown>;
type EntityIndexEntry = [string, EntityDocument];

const technologyRoots = new Set<TinaQueryName>(['caseStudy', 'project', 'experiment']);

let entityIndexPromise: Promise<Map<string, EntityDocument>> | undefined;

async function entityIndexEntries(collection: EntityCollection): Promise<EntityIndexEntry[]> {
  const directory = path.join(contentRoot, collection);
  const filenames = (await readdir(directory)).filter((filename) => filename.endsWith('.json'));
  return Promise.all(
    filenames.map(async (filename) => {
      const document = JSON.parse(
        await readFile(path.join(directory, filename), 'utf8'),
      ) as EntityDocument;
      return [`${collection}/${filename}`, document];
    }),
  );
}

async function buildEntityIndex() {
  const collections: EntityCollection[] = [
    'technologies',
    'languages',
    'categories',
    'tags',
    'topics',
  ];
  const entries = (await Promise.all(collections.map(entityIndexEntries))).flat();
  return new Map(entries);
}

function getEntityIndex() {
  entityIndexPromise ??= buildEntityIndex();
  return entityIndexPromise;
}

function asRecord(value: unknown): UnknownRecord | undefined {
  return value && typeof value === 'object' ? (value as UnknownRecord) : undefined;
}

function referenceItem(value: UnknownRecord): EntityReference | undefined {
  const item = value.item;
  if (typeof item === 'string') {
    return item;
  }
  return asRecord(item);
}

function referencePath(value: unknown): EntityReference | undefined {
  if (typeof value === 'string') {
    return value;
  }
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }
  return 'item' in record ? referenceItem(record) : record;
}

function referenceSlug(reference: EntityReference | undefined): string | undefined {
  if (typeof reference !== 'string') {
    return undefined;
  }
  return reference
    .split('/')
    .at(-1)
    ?.replace(/\.json$/, '');
}

function embeddedEntityName(
  reference: EntityReference | undefined,
  translationKey: TranslationKey,
): string | undefined {
  if (!reference || typeof reference === 'string') {
    return undefined;
  }
  const translations = reference.translations;
  if (!translations || typeof translations !== 'object') {
    return undefined;
  }
  return (translations as Record<TranslationKey, { name?: string }>)[translationKey]?.name;
}

async function entityName(
  value: unknown,
  locale: string | undefined,
  fallbackCollection: EntityCollection,
) {
  const key = getTranslationKey(locale);
  const reference = referencePath(value);
  const embeddedName = embeddedEntityName(reference, key);
  if (embeddedName) {
    return embeddedName;
  }
  return indexedEntityName(reference, key, fallbackCollection);
}

async function indexedEntityName(
  reference: EntityReference | undefined,
  translationKey: TranslationKey,
  collection: EntityCollection,
) {
  const slug = referenceSlug(reference);
  if (!slug) {
    return '';
  }
  const index = await getEntityIndex();
  const entity = index.get(`${collection}/${slug}.json`);
  const translatedName = entity?.translations?.[translationKey]?.name;
  if (translatedName) {
    return translatedName;
  }
  return entity?.code ?? slug;
}

async function referenceNames(
  value: unknown,
  locale: string | undefined,
  collection: EntityCollection,
) {
  const references = Array.isArray(value) ? value : [];
  if (!Array.isArray(value) && value) {
    references.push(value);
  }
  return Promise.all(references.map((item) => entityName(item, locale, collection)));
}

function referenceSlugs(value: unknown): string[] {
  const references = Array.isArray(value) ? value : [];
  if (!Array.isArray(value) && value) {
    references.push(value);
  }
  return references.flatMap((item) => {
    const slug = referenceSlug(referencePath(item));
    return slug ? [slug] : [];
  });
}

type RawTopicMembershipRole = 'primary' | 'related' | 'mentioned';
type RawTopicMembership = { item?: unknown; role?: RawTopicMembershipRole };

function topicMemberships(value: unknown): { topicSlug: string; role?: RawTopicMembershipRole }[] {
  const entries = Array.isArray(value) ? value : [];
  return entries.flatMap((entry) => {
    const membership = asRecord(entry) as RawTopicMembership | undefined;
    const topicSlug = referenceSlug(referencePath(membership));
    return topicSlug ? [{ topicSlug, role: membership?.role }] : [];
  });
}

async function localizeResumeSkills(shared: SharedFields, locale: string | undefined) {
  if (!Array.isArray(shared.skills)) {
    return {};
  }

  return {
    skills: await Promise.all(
      shared.skills.map(async (entry) => {
        const skill = entry as ResumeSkillReference;
        return {
          label: await entityName(skill.category, locale, 'categories'),
          items: await referenceNames(skill.technologies, locale, 'technologies'),
        };
      }),
    ),
  };
}

async function localizeResumeLanguages(shared: SharedFields, locale: string | undefined) {
  if (!Array.isArray(shared.languages)) {
    return {};
  }

  const index = await getEntityIndex();
  return {
    languages: await Promise.all(
      shared.languages.map(async (entry) => {
        const language = entry as ResumeLanguageReference;
        const reference = referencePath(language.language);
        const slug = referenceSlug(reference);
        const entity = slug ? index.get(`languages/${slug}.json`) : undefined;
        const proficiency = language.proficiency;
        return {
          code: entity?.code ?? '',
          name: await entityName(language.language, locale, 'languages'),
          ...(proficiency ? { proficiency } : {}),
        };
      }),
    ),
  };
}

async function localizeResumeFields(shared: SharedFields, locale: string | undefined) {
  return {
    ...(Array.isArray(shared.skills) ? await localizeResumeSkills(shared, locale) : {}),
    ...(Array.isArray(shared.languages) ? await localizeResumeLanguages(shared, locale) : {}),
  };
}

type RawRelation = {
  relationType?: string;
  target?: unknown;
  note?: string;
  context?: string;
  status?: string;
  visibility?: string;
};

type RawReferenceDocument = {
  slug?: string;
  visibility?: string;
  relations?: RawRelation[];
  translations?: Record<TranslationKey, { title?: string }>;
};

function isPublicRawReference(document: RawReferenceDocument | undefined): boolean {
  return document?.visibility === 'public';
}

let referenceGraphPromise: Promise<Map<string, RawReferenceDocument>> | undefined;

async function buildReferenceGraph(): Promise<Map<string, RawReferenceDocument>> {
  const directory = path.join(contentRoot, 'references');
  if (!existsSync(directory)) {
    return new Map();
  }
  const filenames = (await readdir(directory)).filter((filename) => filename.endsWith('.json'));
  const entries = await Promise.all(
    filenames.map(async (filename) => {
      const document = JSON.parse(
        await readFile(path.join(directory, filename), 'utf8'),
      ) as RawReferenceDocument;
      return [filename.replace(/\.json$/, ''), document] as const;
    }),
  );
  return new Map(entries);
}

function getReferenceGraph() {
  referenceGraphPromise ??= buildReferenceGraph();
  return referenceGraphPromise;
}

function referenceTitle(
  document: RawReferenceDocument | undefined,
  translationKey: TranslationKey,
  fallback: string,
) {
  return document?.translations?.[translationKey]?.title || fallback;
}

function relationLabel(
  relationType: RelationTypeId,
  direction: 'outbound' | 'inbound',
  translationKey: TranslationKey,
): string {
  const definition = relationTypes[relationType];
  if (!definition) {
    return relationType;
  }
  if (definition.symmetric) {
    return definition.outboundLabel[translationKey];
  }
  return definition[direction === 'outbound' ? 'outboundLabel' : 'inboundLabel'][translationKey];
}

type ResolvedRelationInput = {
  relationType: RelationTypeId;
  direction: 'outbound' | 'inbound';
  translationKey: TranslationKey;
  relatedSlug: string;
  relatedDocument: RawReferenceDocument | undefined;
  relation: RawRelation;
};

function resolvedRelation(input: ResolvedRelationInput): UnknownRecord {
  const { relationType, direction, translationKey, relatedSlug, relatedDocument, relation } = input;
  return {
    relationType,
    family: relationTypes[relationType]?.family,
    direction,
    label: relationLabel(relationType, direction, translationKey),
    targetSlug: relatedSlug,
    targetTitle: referenceTitle(relatedDocument, translationKey, relatedSlug),
    note: relation.note,
    context: relation.context,
    status: relation.status ?? 'verified',
  };
}

function resolveOutboundRelation(
  entry: unknown,
  graph: Map<string, RawReferenceDocument>,
  translationKey: TranslationKey,
): UnknownRecord | undefined {
  const relation = asRecord(entry) as RawRelation | undefined;
  const relationType = relation?.relationType as RelationTypeId | undefined;
  const targetSlug = relation ? referenceSlug(referencePath(relation.target)) : undefined;
  if (!relation || !relationType || !targetSlug) {
    return undefined;
  }
  const targetDocument = graph.get(targetSlug);
  if (!isPublicRawReference(targetDocument)) {
    return undefined;
  }
  return resolvedRelation({
    relationType,
    direction: 'outbound',
    translationKey,
    relatedSlug: targetSlug,
    relatedDocument: targetDocument,
    relation,
  });
}

async function localizeOutboundRelations(
  value: unknown,
  translationKey: TranslationKey,
): Promise<UnknownRecord[]> {
  const graph = await getReferenceGraph();
  const entries = Array.isArray(value) ? value : [];
  return entries.flatMap((entry) => {
    const resolved = resolveOutboundRelation(entry, graph, translationKey);
    return resolved ? [resolved] : [];
  });
}

type InboundRelationCandidate = {
  relation: RawRelation;
  slug: string;
  sourceSlug: string;
  sourceDocument: RawReferenceDocument;
  translationKey: TranslationKey;
};

function matchingInboundRelation(candidate: InboundRelationCandidate): UnknownRecord | undefined {
  const { relation, slug, sourceSlug, sourceDocument, translationKey } = candidate;
  const relationType = relation.relationType as RelationTypeId | undefined;
  const targetSlug = referenceSlug(referencePath(relation.target));
  if (!relationType || targetSlug !== slug || !isPublicRawReference(sourceDocument)) {
    return undefined;
  }
  return resolvedRelation({
    relationType,
    direction: 'inbound',
    translationKey,
    relatedSlug: sourceSlug,
    relatedDocument: sourceDocument,
    relation,
  });
}

function inboundRelationsFromDocument(
  slug: string,
  sourceSlug: string,
  sourceDocument: RawReferenceDocument,
  translationKey: TranslationKey,
): UnknownRecord[] {
  return (sourceDocument.relations ?? []).flatMap((relation) => {
    const resolved = matchingInboundRelation({
      relation,
      slug,
      sourceSlug,
      sourceDocument,
      translationKey,
    });
    return resolved ? [resolved] : [];
  });
}

export async function getInboundReferenceRelations(
  slug: string,
  locale?: string,
): Promise<UnknownRecord[]> {
  const translationKey = getTranslationKey(locale);
  const graph = await getReferenceGraph();
  const inbound: UnknownRecord[] = [];

  for (const [sourceSlug, document] of graph) {
    if (sourceSlug !== slug) {
      inbound.push(...inboundRelationsFromDocument(slug, sourceSlug, document, translationKey));
    }
  }

  return inbound;
}

type RawTopicRelation = { relationType?: string; target?: unknown; note?: string };

type ResolvedTopicRelation = { relationType: string; targetSlug: string; note?: string };

function resolveTopicRelation(entry: unknown): ResolvedTopicRelation | undefined {
  const relation = asRecord(entry) as RawTopicRelation | undefined;
  const targetSlug = relation ? referenceSlug(referencePath(relation.target)) : undefined;
  if (!relation?.relationType || !targetSlug) {
    return undefined;
  }
  return { relationType: relation.relationType, targetSlug, note: relation.note };
}

function localizeTopicRelations(value: unknown, parentSlug: string | undefined): UnknownRecord[] {
  const entries = Array.isArray(value) ? value : [];
  const resolved = entries.flatMap((entry) => {
    const relation = resolveTopicRelation(entry);
    return relation ? [relation] : [];
  });

  const hasBroaderRelationToParent = resolved.some(
    (relation) => relation.relationType === 'broader-than' && relation.targetSlug === parentSlug,
  );
  if (parentSlug && !hasBroaderRelationToParent) {
    resolved.push({ relationType: 'broader-than', targetSlug: parentSlug });
  }

  return resolved;
}

async function localizeLinks(value: unknown, locale: string | undefined): Promise<UnknownRecord[]> {
  const links = Array.isArray(value) ? value : [];
  return Promise.all(
    links.map(async (entry) => {
      const link = asRecord(entry) ?? {};
      const { linkLanguage, ...rest } = link;
      return {
        ...rest,
        ...(linkLanguage ? { language: await entityName(linkLanguage, locale, 'languages') } : {}),
      };
    }),
  );
}

function creditCategory(value: string | undefined) {
  return value === 'infrastructure' ? 'infrastructure' : 'reference';
}

function creditTranslation(credit: CreditReference, translationKey: TranslationKey) {
  return credit.translations?.[translationKey];
}

function localizeCreditEntry(credit: CreditReference, translationKey: TranslationKey) {
  const translation = creditTranslation(credit, translationKey);
  return {
    url: textOrEmpty(credit.url),
    category: creditCategory(credit.category),
    name: textOrEmpty(translation?.name),
    description: textOrEmpty(translation?.description),
  };
}

function localizeCreditEntries(shared: SharedFields, translationKey: TranslationKey) {
  if (!Array.isArray(shared.entries)) {
    return {};
  }

  return {
    entries: shared.entries.map((entry) =>
      localizeCreditEntry(entry as CreditReference, translationKey),
    ),
  };
}

async function localizeSharedFields(
  shared: SharedFields,
  root: TinaQueryName,
  translationKey: TranslationKey,
  locale: string | undefined,
) {
  let localized = shared;
  if (technologyRoots.has(root)) {
    localized = {
      ...localized,
      technologies: await referenceNames(shared.technologies, locale, 'technologies'),
      technologySlugs: referenceSlugs(shared.technologies),
    };
  }
  if (root === 'writing') {
    localized = {
      ...localized,
      type: await entityName(shared.typeCategory, locale, 'categories'),
      subject: await entityName(shared.subjectCategory, locale, 'categories'),
      tags: await referenceNames(shared.tags, locale, 'tags'),
    };
  }
  if (root === 'resume') {
    localized = {
      ...localized,
      ...(await localizeResumeFields(shared, locale)),
    };
  }
  if (root === 'credits') {
    return {
      ...localized,
      ...localizeCreditEntries(shared, translationKey),
    };
  }
  if (root === 'resource') {
    localized = {
      ...localized,
      topics: await referenceNames(shared.topics, locale, 'topics'),
      topicSlugs: referenceSlugs(shared.topics),
      topicMemberships: topicMemberships(shared.topics),
      language: await entityName(shared.language, locale, 'languages'),
      links: await localizeLinks(shared.links, locale),
      relations: await localizeOutboundRelations(shared.relations, translationKey),
    };
  }
  if (root === 'topic') {
    const parentSlug = referenceSlug(referencePath(shared.parent));
    localized = {
      ...localized,
      parentSlug,
      relations: localizeTopicRelations(shared.relations, parentSlug),
    };
  }

  return localized;
}

export function withContentDefaults<T>(value: T, fields: string[]): T {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  const document = { ...(value as Record<string, unknown>) };
  for (const field of fields) {
    if (!Array.isArray(document[field])) {
      document[field] = [];
    }
  }
  return document as T;
}

async function localizeDocument<T>(
  rawDocument: FieldLocalizedDocument<T>,
  locale: string | undefined,
  root: TinaQueryName,
  relativePath: string,
): Promise<T> {
  const document = await withoutPrivateRelations(
    withoutProtectedFields(withParsedRichText(rawDocument, root), root),
    root,
  );
  const { translations, ...shared } = document;
  const translationKey = getTranslationKey(locale);
  const derived =
    root === 'caseStudy' && typeof shared.order === 'number'
      ? { number: String(shared.order).padStart(2, '0') }
      : {};
  return withContentDefaults(
    {
      ...(await localizeSharedFields(shared, root, translationKey, locale)),
      ...derived,
      ...withoutHiddenItems(translations[translationKey]),
      _contentEditing: { ...createTinaPayload(root, relativePath, document), root },
    } as T,
    arrayFieldsByRoot[root] ?? [],
  );
}

async function readDocument<T>(
  filename: string,
  locale: string | undefined,
  root: TinaQueryName,
): Promise<T> {
  const source = await readFile(filename, 'utf8');
  return localizeDocument(
    JSON.parse(source) as FieldLocalizedDocument<T>,
    locale,
    root,
    path.basename(filename),
  );
}

const collectionRoots: Record<ContentCollection, TinaQueryName> = {
  cases: 'caseStudy',
  projects: 'project',
  experiments: 'experiment',
  writing: 'writing',
  references: 'resource',
  collections: 'referenceCollection',
  topics: 'topic',
};

export async function getContentCollection<T>(
  collection: ContentCollection,
  locale?: string,
): Promise<T[]> {
  const directory = path.join(contentRoot, collection);
  const filenames = (await readdir(directory))
    .filter((filename) => filename.endsWith('.json'))
    .sort();

  const documents = await Promise.all(
    filenames.map((filename) =>
      readDocument<T>(path.join(directory, filename), locale, collectionRoots[collection]),
    ),
  );

  return documents.filter((document) => !isHidden(document));
}

export async function getContentDocument<T>(
  collection: ContentCollection,
  slug: string,
  locale?: string,
): Promise<T | undefined> {
  if (!isSafeSlug(slug)) {
    return undefined;
  }

  try {
    const document = await readDocument<T>(
      path.join(contentRoot, collection, `${slug}.json`),
      locale,
      collectionRoots[collection],
    );
    return isHidden(document) ? undefined : document;
  } catch (error) {
    if (isMissingFileError(error)) {
      return undefined;
    }
    throw error;
  }
}

function isMissingFileError(error: unknown) {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

export async function getLocalizedPage<T>(slug: string, locale?: string): Promise<T> {
  if (!isSafeSlug(slug)) {
    throw new Error(`Invalid page slug: ${slug}`);
  }
  const pageRoot = `${slug}Page` as TinaQueryName;
  return readDocument<T>(path.join(contentRoot, 'pages', `${slug}.json`), locale, pageRoot);
}

export async function getLocalizedProfile(locale?: string): Promise<Profile> {
  return readDocument<Profile>(
    path.join(contentRoot, 'profile', 'profile.json'),
    locale,
    'profile',
  );
}

type OrderedTechnologyBadge = TechnologyBadge & { order: number };

function orderedTechnologyBadge(
  entity: EntityDocument,
  slug: string,
  translationKey: TranslationKey,
): OrderedTechnologyBadge {
  const name = entity.translations?.[translationKey]?.name ?? slug;
  const order = entity.order ?? Number.MAX_SAFE_INTEGER;
  return { slug, name, order, ...(entity.logo ? { logo: entity.logo } : {}) };
}

function compareTechnologyBadges(left: OrderedTechnologyBadge, right: OrderedTechnologyBadge) {
  return left.order - right.order || left.name.localeCompare(right.name);
}

function withoutBadgeOrder(badge: OrderedTechnologyBadge): TechnologyBadge {
  return { slug: badge.slug, name: badge.name, ...(badge.logo ? { logo: badge.logo } : {}) };
}

export async function listTechnologies(
  slugs: string[],
  locale?: string,
): Promise<TechnologyBadge[]> {
  const index = await getEntityIndex();
  const translationKey = getTranslationKey(locale);
  const badges = [...new Set(slugs)].flatMap((slug) => {
    const entity = index.get(`technologies/${slug}.json`);
    return entity ? [orderedTechnologyBadge(entity, slug, translationKey)] : [];
  });
  return badges.sort(compareTechnologyBadges).map(withoutBadgeOrder);
}

export async function getLocalizedResume(locale?: string): Promise<ResumeContent> {
  return readDocument<ResumeContent>(
    path.join(contentRoot, 'resume', 'resume.json'),
    locale,
    'resume',
  );
}

export async function getLocalizedCredits(locale?: string): Promise<CreditsContent> {
  return readDocument<CreditsContent>(
    path.join(contentRoot, 'credits', 'credits.json'),
    locale,
    'credits',
  );
}

function optionalText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function textOrEmpty(value: string | undefined) {
  return value ?? '';
}

function normalizedMaintenance(siteText: SiteText) {
  return {
    eyebrow: textOrEmpty(siteText.maintenance?.eyebrow),
    title: textOrEmpty(siteText.maintenance?.title),
    description: textOrEmpty(siteText.maintenance?.description),
  };
}

type RawContactSettings = { contact?: { email?: string } };

let contactEmailPromise: Promise<string> | undefined;
let emailChallengePromise: Promise<ProtectedEmailChallenge> | undefined;

async function readContactEmail(): Promise<string> {
  const source = await readFile(path.join(contentRoot, 'settings', 'site.json'), 'utf8');
  return (JSON.parse(source) as RawContactSettings).contact?.email?.trim() ?? '';
}

export function getContactEmail(): Promise<string> {
  contactEmailPromise ??= readContactEmail();
  return contactEmailPromise;
}

function getEmailChallenge(email: string): Promise<ProtectedEmailChallenge> {
  emailChallengePromise ??= createEmailChallenge(email);
  return emailChallengePromise;
}

async function normalizedContact(siteText: SiteText) {
  const email = await getContactEmail();
  return {
    hasEmail: email.length > 0,
    ...(email ? { emailChallenge: await getEmailChallenge(email) } : {}),
    profiles: Array.isArray(siteText.contact?.profiles) ? siteText.contact.profiles : [],
    available: siteText.contact?.available ?? false,
  };
}

export async function getLocalizedSiteText(locale?: string): Promise<SiteText> {
  const localized = await readDocument<SiteText>(
    path.join(contentRoot, 'settings', 'site.json'),
    locale,
    'settings',
  );
  return {
    ...localized,
    portfolioUrl: optionalText(localized.portfolioUrl),
    maintenanceEnabled: localized.maintenanceEnabled ?? false,
    maintenance: normalizedMaintenance(localized),
    contact: await normalizedContact(localized),
  };
}

export async function getLocalizedInterface(locale?: string): Promise<InterfaceMessages> {
  const source = JSON.parse(
    await readFile(path.join(contentRoot, 'settings', 'interface.json'), 'utf8'),
  ) as FieldLocalizedDocument<InterfaceMessages>;
  return source.translations[getTranslationKey(locale)];
}
