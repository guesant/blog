import type {
  AboutPageCopy,
  CaseStudy,
  CreditsPageContent,
  Experiment,
  HomePageContent,
  PageIntroduction,
  PortfolioPageCopy,
  Profile,
  Project,
  ProjectsPageCopy,
  Reference,
  ReferenceCollectionDetail,
  SiteText,
  PublicFeedItem,
  Snippet,
  Topic,
  Technology,
  Writing,
} from '@portfolio/data/domain/types';
import type {
  getFollowPageCopy,
  getLicensePageCopy,
  getNowPageCopy,
  getResumePageContent,
} from '@portfolio/data/services';
import type { ContentCollectionMeta } from '../api/public-site-source-support';
import type { RouteRequest } from './content-data-support';

type ContentFeedRouteData = {
  page: PageIntroduction;
  feedItems: PublicFeedItem[];
  feedPagination: ContentCollectionMeta;
};

export type RouteData =
  | { kind: 'loading' }
  | {
      kind: 'home';
      content: HomePageContent;
      feedItems: PublicFeedItem[];
      feedPagination: ContentCollectionMeta;
    }
  | { kind: 'about'; page: AboutPageCopy; profile: Profile }
  | {
      kind: 'portfolio';
      page: PortfolioPageCopy;
      profile: Profile;
      cases: CaseStudy[];
      casesPagination: ContentCollectionMeta;
      projects: Project[];
      projectsPagination: ContentCollectionMeta;
      experiments: Experiment[];
      experimentsPagination: ContentCollectionMeta;
      search: string;
    }
  | { kind: 'now'; page: Awaited<ReturnType<typeof getNowPageCopy>> }
  | {
      kind: 'cases';
      page: PageIntroduction;
      items: CaseStudy[];
      pagination: ContentCollectionMeta;
    }
  | { kind: 'case-detail'; item: CaseStudy }
  | ({
      kind: 'collections';
    } & ContentFeedRouteData)
  | { kind: 'collection-detail'; collection: ReferenceCollectionDetail }
  | { kind: 'contact'; page: PageIntroduction; site: SiteText }
  | { kind: 'credits'; content: CreditsPageContent }
  | ({
      kind: 'findings';
      request: Pick<RouteRequest, 'locale' | 'search'>;
    } & ContentFeedRouteData)
  | { kind: 'finding-detail'; item: Reference }
  | {
      kind: 'finding-type';
      type: string;
      references: Reference[];
      pagination: ContentCollectionMeta;
    }
  | { kind: 'license'; page: Awaited<ReturnType<typeof getLicensePageCopy>>; site: SiteText }
  | { kind: 'follow'; page: Awaited<ReturnType<typeof getFollowPageCopy>>; site: SiteText }
  | {
      kind: 'projects';
      page: ProjectsPageCopy;
      projects: Project[];
      projectsPagination: ContentCollectionMeta;
      experiments: Experiment[];
      experimentsPagination: ContentCollectionMeta;
    }
  | { kind: 'project-detail'; project: Project }
  | { kind: 'experiment-detail'; experiment: Experiment }
  | {
      kind: 'resume';
      content: Awaited<ReturnType<typeof getResumePageContent>>;
      pdfUrls: Record<'en' | 'pt-BR', string>;
    }
  | { kind: 'snippets'; snippets: Snippet[]; pagination: ContentCollectionMeta }
  | { kind: 'snippet-detail'; snippet: Snippet }
  | { kind: 'technologies'; technologies: Technology[]; pagination: ContentCollectionMeta }
  | { kind: 'technology-detail'; technology: Technology }
  | {
      kind: 'status';
      status: 'notFound' | 'error';
      sourceRepositoryUrl?: string;
    }
  | { kind: 'topics'; topics: Topic[]; pagination: ContentCollectionMeta }
  | {
      kind: 'topic-detail';
      topic: Topic;
      references: Reference[];
      pagination: ContentCollectionMeta;
    }
  | ({
      kind: 'writing';
    } & ContentFeedRouteData)
  | { kind: 'writing-detail'; item: Writing };
