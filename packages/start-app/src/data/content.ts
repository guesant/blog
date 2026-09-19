import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import {
  getAboutPageCopy,
  getAchadosPageCopy,
  getCaseBySlug,
  getCases,
  getCasesPageCopy,
  getCollectionsPageCopy,
  getContactPageCopy,
  getExperimentBySlug,
  getExperiments,
  getHomePageContent,
  getInterfaceMessages,
  getKnowledgeGraph,
  getLatestNotes,
  getNavigationAvailability,
  getProfile,
  getProjectBySlug,
  getProjects,
  getProjectsPageCopy,
  getReferenceBySlug,
  getReferenceCollectionBySlug,
  getReferenceCollections,
  getReferences,
  getReferencesByTopic,
  getResumePageContent,
  getSiteText,
  getTopicBySlug,
  getTopics,
  getWritingBySlug,
  getWritingPageCopy,
  withPublicSiteSnapshot,
} from '@portfolio/content/server';
import { getCreditsPageContent } from '../../content/credits';
import type {
  AboutPageCopy,
  CaseStudy,
  CreditsPageContent,
  Experiment,
  HomePageContent,
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
  ResumeContent,
  SiteText,
  Topic,
  Writing,
} from '@portfolio/content/types';

export type ShellData = {
  profile: Profile;
  site: SiteText;
  availability: NavigationAvailability;
  messages: InterfaceMessages;
};

export type RouteData =
  | { kind: 'home'; content: HomePageContent; writings: Writing[]; findings: Reference[]; collections: ReferenceCollection[] }
  | { kind: 'about'; page: AboutPageCopy; profile: Profile }
  | { kind: 'cases'; page: PageIntroduction; items: CaseStudy[] }
  | { kind: 'case-detail'; item: CaseStudy }
  | { kind: 'collections'; page: PageIntroduction; writings: Writing[]; findings: Reference[]; collections: ReferenceCollection[] }
  | { kind: 'collection-detail'; collection: ReferenceCollectionDetail }
  | { kind: 'contact'; page: PageIntroduction; site: SiteText }
  | { kind: 'credits'; content: CreditsPageContent }
  | { kind: 'findings'; page: PageIntroduction; writings: Writing[]; findings: Reference[]; collections: ReferenceCollection[] }
  | { kind: 'finding-detail'; item: Reference }
  | { kind: 'finding-type'; type: string; references: Reference[] }
  | { kind: 'knowledge-map'; graph: KnowledgeGraph }
  | { kind: 'license'; site: SiteText }
  | { kind: 'projects'; page: ProjectsPageCopy; projects: Project[]; experiments: Experiment[] }
  | { kind: 'project-detail'; project: Project }
  | { kind: 'experiment-detail'; experiment: Experiment }
  | {
      kind: 'resume';
      content: Awaited<ReturnType<typeof getResumePageContent>>;
      pdfUrls: Record<'en' | 'pt-BR', string>;
    }
  | { kind: 'tools' }
  | { kind: 'topics'; topics: Topic[] }
  | { kind: 'topic-detail'; topic: Topic; references: Reference[] }
  | { kind: 'writing'; page: PageIntroduction; writings: Writing[]; findings: Reference[]; collections: ReferenceCollection[] }
  | { kind: 'writing-detail'; item: Writing };

type RouteRequest = { locale: string; pathname: string; slug?: string; type?: string };

const requestSchema = (value: RouteRequest) => value;

function publicApiBaseUrl(): string {
  return (process.env.PORTFOLIO_PUBLIC_API_URL ?? '/api/v1').replace(/\/$/, '');
}

function resumePdfUrls(): Record<'en' | 'pt-BR', string> {
  const baseUrl = publicApiBaseUrl();
  return {
    en: `${baseUrl}/resume/en.pdf`,
    'pt-BR': `${baseUrl}/resume/pt-BR.pdf`,
  };
}

function serializable<T>(value: T): never {
  return JSON.parse(JSON.stringify(value)) as never;
}

export const loadShell = createServerFn({ method: 'GET' })
  .validator((locale: string) => locale)
  .handler(async ({ data: locale }) =>
    serializable(
      await withPublicSiteSnapshot(locale, async () => {
        const [profile, site, availability, messages] = await Promise.all([
          getProfile(locale),
          getSiteText(locale),
          getNavigationAvailability(locale),
          getInterfaceMessages(locale),
        ]);
        return { profile, site, availability, messages };
      }),
    ),
  );

async function loadRouteData(data: RouteRequest): Promise<RouteData> {
    const { locale, pathname, slug, type } = data;
    switch (pathname) {
      case '/':
        return {
          kind: 'home',
          content: await getHomePageContent(locale),
          writings: await getLatestNotes(locale),
          findings: await getReferences(locale),
          collections: await getReferenceCollections(locale),
        };
      case '/about':
        return { kind: 'about', page: await getAboutPageCopy(locale), profile: await getProfile(locale) };
      case '/cases':
        return { kind: 'cases', page: await getCasesPageCopy(locale), items: await getCases(locale) };
      case '/collections':
      case '/colecoes':
        return {
          kind: 'collections',
          page: await getCollectionsPageCopy(locale),
          writings: await getLatestNotes(locale),
          findings: await getReferences(locale),
          collections: await getReferenceCollections(locale),
        };
      case '/contact':
        return { kind: 'contact', page: await getContactPageCopy(locale), site: await getSiteText(locale) };
      case '/credits':
        return {
          kind: 'credits',
          content: await getCreditsPageContent(locale),
        };
      case '/findings':
        return {
          kind: 'findings',
          page: await getAchadosPageCopy(locale),
          writings: await getLatestNotes(locale),
          findings: await getReferences(locale),
          collections: await getReferenceCollections(locale),
        };
      case '/knowledge-map':
        return { kind: 'knowledge-map', graph: await getKnowledgeGraph(locale) };
      case '/license':
        return { kind: 'license', site: await getSiteText(locale) };
      case '/projects':
        return {
          kind: 'projects',
          page: await getProjectsPageCopy(locale),
          projects: await getProjects(locale),
          experiments: await getExperiments(locale),
        };
      case '/resume':
        return {
          kind: 'resume',
          content: await getResumePageContent(locale),
          pdfUrls: resumePdfUrls(),
        };
      case '/tools/password-generator':
      case '/tools/random-string-generator':
        return { kind: 'tools' };
      case '/topics':
        return { kind: 'topics', topics: await getTopics(locale) };
      case '/writing':
        return {
          kind: 'writing',
          page: await getWritingPageCopy(locale),
          writings: await getLatestNotes(locale),
          findings: await getReferences(locale),
          collections: await getReferenceCollections(locale),
        };
      case '/case-detail': {
        const item = slug ? await getCaseBySlug(slug, locale) : undefined;
        if (!item) throw new Response('Not found', { status: 404 });
        return { kind: 'case-detail', item };
      }
      case '/collection-detail': {
        const collection = slug ? await getReferenceCollectionBySlug(slug, locale) : undefined;
        if (!collection) throw new Response('Not found', { status: 404 });
        return { kind: 'collection-detail', collection };
      }
      case '/finding-detail': {
        const item = slug ? await getReferenceBySlug(slug, locale) : undefined;
        if (!item) throw new Response('Not found', { status: 404 });
        return { kind: 'finding-detail', item };
      }
      case '/finding-type':
        return { kind: 'finding-type', type: type ?? '', references: await getReferences(locale) };
      case '/project-detail': {
        const project = slug ? await getProjectBySlug(slug, locale) : undefined;
        if (!project) throw new Response('Not found', { status: 404 });
        return { kind: 'project-detail', project };
      }
      case '/experiment-detail': {
        const experiment = slug ? await getExperimentBySlug(slug, locale) : undefined;
        if (!experiment) throw new Response('Not found', { status: 404 });
        return { kind: 'experiment-detail', experiment };
      }
      case '/topic-detail': {
        if (!slug) throw new Response('Not found', { status: 404 });
        const topic = slug ? await getTopicBySlug(slug, locale) : undefined;
        if (!topic) throw new Response('Not found', { status: 404 });
        return { kind: 'topic-detail', topic, references: await getReferencesByTopic(slug, locale) };
      }
      case '/writing-detail': {
        const item = slug ? await getWritingBySlug(slug, locale) : undefined;
        if (!item) throw new Response('Not found', { status: 404 });
        return { kind: 'writing-detail', item };
      }
      default:
        throw new Response('Not found', { status: 404 });
    }
}

export const loadRoute = createServerFn({ method: 'GET' })
  .validator(requestSchema)
  .handler(async ({ data }) =>
    serializable(await withPublicSiteSnapshot(data.locale, () => loadRouteData(data))),
  );

export const shellQueryOptions = (locale: string) =>
  queryOptions<ShellData>({
    queryKey: ['shell', locale],
    queryFn: () => loadShell({ data: locale }) as unknown as Promise<ShellData>,
  });

export const routeQueryOptions = (request: RouteRequest) =>
  queryOptions<RouteData>({
    queryKey: ['route', request.locale, request.pathname, request.slug, request.type],
    queryFn: () => loadRoute({ data: request }) as unknown as Promise<RouteData>,
  });
