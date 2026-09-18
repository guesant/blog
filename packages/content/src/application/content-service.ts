import {
  getContentCollection,
  getContentDocument,
  getInboundReferenceRelations,
  getLocalizedCredits,
  getLocalizedInterface,
  getLocalizedPage,
  getLocalizedProfile,
  getLocalizedResume,
  getLocalizedSiteText,
  listTechnologies,
  normalizeLocale,
  getContactEmail as readContactEmail,
} from '../adapters/api/public-site-source.ts';
import { relationTypes } from '../domain/relation-types.ts';
import type {
  AboutPageCopy,
  CaseStudy,
  ContentReference,
  CreditsPageCopy,
  Experiment,
  GraphEdge,
  GraphNode,
  HomePageContent,
  HomePageCopy,
  InterfaceMessages,
  KnowledgeGraph,
  NavigationAvailability,
  PageIntroduction,
  Profile,
  Project,
  ProjectsPageCopy,
  Reference,
  ReferenceCollection,
  ReferenceCollectionDetail,
  ReferenceCollectionItem,
  ResumeContent,
  ResumePageContent,
  ResumePageCopy,
  SiteText,
  Topic,
  TopicMembership,
  Writing,
} from '../domain/types.ts';

const byOrder = <T extends { order: number }>(left: T, right: T) => left.order - right.order;

function referenceSlug(reference: ContentReference) {
  const path = typeof reference === 'string' ? reference : reference.item;
  const filename = path.split('/').at(-1) ?? path;
  return filename.replace(/\.json$/, '');
}

function selectByReferences<T extends { slug: string }>(
  items: T[],
  references: ContentReference[] = [],
) {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  return references.flatMap((reference) => {
    const item = bySlug.get(referenceSlug(reference));
    return item ? [item] : [];
  });
}

export async function getHomePageContent(locale?: string): Promise<HomePageContent> {
  const [cases, projects, experiments, writings, page] = await Promise.all([
    getCases(locale),
    getProjects(locale),
    getExperiments(locale),
    getLatestNotes(locale),
    getLocalizedPage<HomePageCopy>('home', locale),
  ]);

  return {
    cases: selectByReferences(cases, page.featuredCases),
    projects: selectByReferences(projects, page.featuredProjects),
    experiments,
    writings: selectByReferences(writings, page.featuredWriting),
    profile: await getLocalizedProfile(locale),
    resume: await getLocalizedResume(locale),
    page,
    site: await getLocalizedSiteText(locale),
    recurringTechnologies: await listTechnologies(
      [...cases, ...projects].flatMap((item) => item.technologySlugs ?? []),
      locale,
    ),
  };
}

export async function getCases(locale?: string): Promise<CaseStudy[]> {
  return (await getContentCollection<CaseStudy>('cases', locale)).sort(byOrder);
}

export async function getCaseBySlug(slug: string, locale?: string): Promise<CaseStudy | undefined> {
  return getContentDocument<CaseStudy>('cases', slug, locale);
}

export async function getProjects(locale?: string): Promise<Project[]> {
  return (await getContentCollection<Project>('projects', locale)).sort(byOrder);
}

export async function getProjectBySlug(
  slug: string,
  locale?: string,
): Promise<Project | undefined> {
  return getContentDocument<Project>('projects', slug, locale);
}

export async function getExperiments(locale?: string): Promise<Experiment[]> {
  return (await getContentCollection<Experiment>('experiments', locale)).sort(byOrder);
}

export async function getExperimentBySlug(
  slug: string,
  locale?: string,
): Promise<Experiment | undefined> {
  return getContentDocument<Experiment>('experiments', slug, locale);
}

export async function getLatestNotes(locale?: string): Promise<Writing[]> {
  const language = normalizeLocale(locale);
  return (await getContentCollection<Writing>('writing', locale))
    .map((writing) => ({ ...writing, language }))
    .sort((left, right) => (right.dateISO || '').localeCompare(left.dateISO || ''));
}

export async function getWritingBySlug(
  slug: string,
  locale?: string,
): Promise<Writing | undefined> {
  const writing = await getContentDocument<Writing>('writing', slug, locale);
  return writing ? { ...writing, language: normalizeLocale(locale) } : undefined;
}

export async function getProfile(locale?: string): Promise<Profile> {
  return getLocalizedProfile(locale);
}

export async function getResume(locale?: string): Promise<ResumeContent> {
  return getLocalizedResume(locale);
}

export function getContactEmail(): Promise<string> {
  return readContactEmail();
}

export async function getSiteText(locale?: string): Promise<SiteText> {
  return getLocalizedSiteText(locale);
}

export async function getInterfaceMessages(locale?: string): Promise<InterfaceMessages> {
  return getLocalizedInterface(locale);
}

export async function getNavigationAvailability(locale?: string): Promise<NavigationAvailability> {
  const [cases, projects, experiments, writings, references] = await Promise.all([
    getCases(locale),
    getProjects(locale),
    getExperiments(locale),
    getLatestNotes(locale),
    getReferences(locale),
  ]);
  const site = await getLocalizedSiteText(locale);

  return {
    cases: cases.length > 0,
    projects: projects.length > 0 || experiments.length > 0,
    writing: writings.length > 0,
    achados: references.length > 0,
    contact: Boolean(
      site.contact.available && (site.contact.hasEmail || site.contact.profiles.length > 0),
    ),
  };
}

export async function getAchadosPageCopy(locale?: string): Promise<PageIntroduction> {
  return getLocalizedPage<PageIntroduction>('achados', locale);
}

export async function getAboutPageCopy(locale?: string): Promise<AboutPageCopy> {
  return getLocalizedPage<AboutPageCopy>('about', locale);
}

export async function getCasesPageCopy(locale?: string): Promise<PageIntroduction> {
  return getLocalizedPage<PageIntroduction>('cases', locale);
}

export async function getProjectsPageCopy(locale?: string): Promise<ProjectsPageCopy> {
  return getLocalizedPage<ProjectsPageCopy>('projects', locale);
}

export async function getWritingPageCopy(locale?: string): Promise<PageIntroduction> {
  return getLocalizedPage<PageIntroduction>('writing', locale);
}

export async function getContactPageCopy(locale?: string): Promise<PageIntroduction> {
  return getLocalizedPage<PageIntroduction>('contact', locale);
}

export async function getResumePageCopy(locale?: string): Promise<ResumePageCopy> {
  return getLocalizedPage<ResumePageCopy>('resume', locale);
}

export async function getResumePageContent(locale?: string): Promise<ResumePageContent> {
  const [cases, resume, page] = await Promise.all([
    getCases(locale),
    getLocalizedResume(locale),
    getResumePageCopy(locale),
  ]);

  return {
    profile: await getLocalizedProfile(locale),
    site: await getLocalizedSiteText(locale),
    resume,
    page,
    cases: selectByReferences(cases, resume.selectedCases),
  };
}

export async function getCreditsPageCopy(locale?: string): Promise<CreditsPageCopy> {
  return getLocalizedPage<CreditsPageCopy>('credits', locale);
}

export async function getCredits(locale?: string) {
  return getLocalizedCredits(locale);
}

type VisibilityBearing = Pick<Reference, 'visibility'>;

function isPubliclyVisible(reference: VisibilityBearing): boolean {
  return reference.visibility === 'public';
}

export async function getReferences(locale?: string): Promise<Reference[]> {
  return (await getContentCollection<Reference>('references', locale))
    .filter(isPubliclyVisible)
    .sort(byOrder);
}

export async function getReferenceBySlug(
  slug: string,
  locale?: string,
): Promise<Reference | undefined> {
  const reference = await getContentDocument<Reference>('references', slug, locale);
  if (!reference || !isPubliclyVisible(reference)) {
    return undefined;
  }
  const inbound = await getInboundReferenceRelations(slug, locale);
  return {
    ...reference,
    relations: [...reference.relations, ...(inbound as Reference['relations'])],
  };
}

export async function getTopics(locale?: string): Promise<Topic[]> {
  return getContentCollection<Topic>('topics', locale);
}

export async function getTopicBySlug(slug: string, locale?: string): Promise<Topic | undefined> {
  return getContentDocument<Topic>('topics', slug, locale);
}

export async function getReferencesByTopic(slug: string, locale?: string): Promise<Reference[]> {
  const references = await getReferences(locale);
  return references.filter((reference) => reference.topicSlugs?.includes(slug));
}

const hasTopicLabel = { en: 'has topic', ptBR: 'tem tópico' };

function graphTranslationKey(locale?: string): 'en' | 'ptBR' {
  return normalizeLocale(locale) === 'pt-BR' ? 'ptBR' : 'en';
}

function topicRelationLabel(relationType: string, locale?: string): string | undefined {
  const definition = relationTypes[relationType as keyof typeof relationTypes];
  return definition?.outboundLabel[graphTranslationKey(locale)];
}

function knowledgeGraphNodes(references: Reference[], topics: Topic[]): GraphNode[] {
  const referenceNodes = references.map(
    (reference): GraphNode => ({
      id: reference.slug,
      kind: 'reference',
      label: reference.title,
      meta: { type: reference.type },
    }),
  );
  const topicNodes = topics.map(
    (topic): GraphNode => ({
      id: topic.slug,
      kind: 'topic',
      label: topic.name,
      meta: { kind: topic.kind ?? 'topic' },
    }),
  );
  return [...referenceNodes, ...topicNodes];
}

function referenceRelationEdges(reference: Reference, nodeIds: Set<string>): GraphEdge[] {
  return reference.relations.flatMap((relation) =>
    nodeIds.has(relation.targetSlug)
      ? [
          {
            source: reference.slug,
            target: relation.targetSlug,
            relationType: relation.relationType,
            label: relation.label,
          },
        ]
      : [],
  );
}

function membershipLabel(membership: TopicMembership, locale?: string): string {
  const baseLabel = hasTopicLabel[graphTranslationKey(locale)];
  return membership.role && membership.role !== 'primary'
    ? `${baseLabel} (${membership.role})`
    : baseLabel;
}

function referenceMembershipEdges(
  reference: Reference,
  nodeIds: Set<string>,
  locale?: string,
): GraphEdge[] {
  const memberships: TopicMembership[] =
    reference.topicMemberships ??
    (reference.topicSlugs ?? []).map((topicSlug): TopicMembership => ({ topicSlug }));
  return memberships.flatMap((membership) =>
    nodeIds.has(membership.topicSlug)
      ? [
          {
            source: reference.slug,
            target: membership.topicSlug,
            relationType: 'has-topic',
            label: membershipLabel(membership, locale),
          },
        ]
      : [],
  );
}

function topicRelationEdges(topic: Topic, nodeIds: Set<string>, locale?: string): GraphEdge[] {
  return (topic.relations ?? []).flatMap((relation) =>
    nodeIds.has(relation.targetSlug)
      ? [
          {
            source: topic.slug,
            target: relation.targetSlug,
            relationType: relation.relationType,
            label: topicRelationLabel(relation.relationType, locale),
          },
        ]
      : [],
  );
}

export async function getKnowledgeGraph(locale?: string): Promise<KnowledgeGraph> {
  const [references, topics] = await Promise.all([getReferences(locale), getTopics(locale)]);
  const nodes = knowledgeGraphNodes(references, topics);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = [
    ...references.flatMap((reference) => referenceRelationEdges(reference, nodeIds)),
    ...references.flatMap((reference) => referenceMembershipEdges(reference, nodeIds, locale)),
    ...topics.flatMap((topic) => topicRelationEdges(topic, nodeIds, locale)),
  ];
  return { nodes, edges };
}

export async function getReferenceCollections(locale?: string): Promise<ReferenceCollection[]> {
  return (await getContentCollection<ReferenceCollection>('collections', locale)).sort(byOrder);
}

type RawCollectionItem = { item?: ContentReference; note?: string };

function collectionItemSlug(item: ContentReference | undefined): string | undefined {
  if (!item) {
    return undefined;
  }
  return referenceSlug(item);
}

export async function getReferenceCollectionBySlug(
  slug: string,
  locale?: string,
): Promise<ReferenceCollectionDetail | undefined> {
  const [collection, references] = await Promise.all([
    getContentDocument<ReferenceCollection & { items?: RawCollectionItem[] }>(
      'collections',
      slug,
      locale,
    ),
    getReferences(locale),
  ]);
  if (!collection) {
    return undefined;
  }

  const bySlug = new Map(references.map((reference) => [reference.slug, reference]));
  const { items: rawItems, ...rest } = collection;
  const items: ReferenceCollectionItem[] = (rawItems ?? []).flatMap((entry) => {
    const itemSlug = collectionItemSlug(entry.item);
    const reference = itemSlug ? bySlug.get(itemSlug) : undefined;
    return reference ? [{ reference, note: entry.note }] : [];
  });

  return { ...rest, items };
}
