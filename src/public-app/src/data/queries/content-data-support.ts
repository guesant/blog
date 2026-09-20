import { createServerFn } from '@tanstack/react-start';
import {
  getInterfaceMessages,
  getNavigationAvailability,
  getFollowPageCopy,
  getLicensePageCopy,
  getNowPageCopy,
  getProfile,
  getResumePageContent,
  getSiteText,
  withPublicSiteSnapshot,
} from '@portfolio/data/services';
import type {
  AboutPageCopy,
  CaseStudy,
  CreditsPageContent,
  Experiment,
  HomePageContent,
  InterfaceMessages,
  NavigationAvailability,
  PageIntroduction,
  PortfolioPageCopy,
  Profile,
  Project,
  ProjectsPageCopy,
  Reference,
  ReferenceCollection,
  ReferenceCollectionDetail,
  Snippet,
  SiteText,
  Topic,
  Technology,
  Writing,
} from '@portfolio/data/domain/types';
import { serializable } from './content-data-serializable';
import { requestSchema } from './content-data-request-schema';
import { loadRouteData } from './content-data-load-route-data';

export type ShellData = {
  profile: Profile;
  site: SiteText;
  availability: NavigationAvailability;
  messages: InterfaceMessages;
};

export type RouteData =
  | {
      kind: 'home';
      content: HomePageContent;
      writings: Writing[];
      findings: Reference[];
      collections: ReferenceCollection[];
    }
  | { kind: 'about'; page: AboutPageCopy; profile: Profile }
  | {
      kind: 'portfolio';
      page: PortfolioPageCopy;
      profile: Profile;
      cases: CaseStudy[];
      projects: Project[];
      experiments: Experiment[];
    }
  | { kind: 'now'; page: Awaited<ReturnType<typeof getNowPageCopy>> }
  | { kind: 'cases'; page: PageIntroduction; items: CaseStudy[] }
  | { kind: 'case-detail'; item: CaseStudy }
  | {
      kind: 'collections';
      page: PageIntroduction;
      writings: Writing[];
      findings: Reference[];
      collections: ReferenceCollection[];
    }
  | { kind: 'collection-detail'; collection: ReferenceCollectionDetail }
  | { kind: 'contact'; page: PageIntroduction; site: SiteText }
  | { kind: 'credits'; content: CreditsPageContent }
  | {
      kind: 'findings';
      page: PageIntroduction;
      request: Pick<RouteRequest, 'locale' | 'search'>;
    }
  | { kind: 'finding-detail'; item: Reference }
  | { kind: 'finding-type'; type: string; references: Reference[] }
  | { kind: 'license'; page: Awaited<ReturnType<typeof getLicensePageCopy>>; site: SiteText }
  | { kind: 'follow'; page: Awaited<ReturnType<typeof getFollowPageCopy>>; site: SiteText }
  | { kind: 'projects'; page: ProjectsPageCopy; projects: Project[]; experiments: Experiment[] }
  | { kind: 'project-detail'; project: Project }
  | { kind: 'experiment-detail'; experiment: Experiment }
  | {
      kind: 'resume';
      content: Awaited<ReturnType<typeof getResumePageContent>>;
      pdfUrls: Record<'en' | 'pt-BR', string>;
    }
  | { kind: 'tools-index' }
  | { kind: 'tool'; slug: string }
  | { kind: 'snippets'; snippets: Snippet[] }
  | { kind: 'snippet-detail'; snippet: Snippet }
  | { kind: 'technologies'; technologies: Technology[] }
  | { kind: 'technology-detail'; technology: Technology }
  | {
      kind: 'status';
      status: 'notFound' | 'error';
      sourceRepositoryUrl?: string;
    }
  | { kind: 'topics'; topics: Topic[] }
  | { kind: 'topic-detail'; topic: Topic; references: Reference[] }
  | {
      kind: 'writing';
      page: PageIntroduction;
      writings: Writing[];
      findings: Reference[];
      collections: ReferenceCollection[];
    }
  | { kind: 'writing-detail'; item: Writing };

export type RouteRequest = {
  locale: string;
  pathname: string;
  slug?: string;
  type?: string;
  search?: string;
};

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

export const loadRoute = createServerFn({ method: 'GET' })
  .validator(requestSchema)
  .handler(async ({ data }) =>
    serializable(await withPublicSiteSnapshot(data.locale, () => loadRouteData(data))),
  );
