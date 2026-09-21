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
  ReferenceCollection,
  ReferenceCollectionDetail,
  SiteText,
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

export type RouteData =
  | {
      kind: 'home';
      content: HomePageContent;
      writings: Writing[];
      findings: Reference[];
      collections: ReferenceCollection[];
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
    }
  | { kind: 'now'; page: Awaited<ReturnType<typeof getNowPageCopy>> }
  | {
      kind: 'cases';
      page: PageIntroduction;
      items: CaseStudy[];
      pagination: ContentCollectionMeta;
    }
  | { kind: 'case-detail'; item: CaseStudy }
  | {
      kind: 'collections';
      page: PageIntroduction;
      writings: Writing[];
      findings: Reference[];
      collections: ReferenceCollection[];
      pagination: ContentCollectionMeta;
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
  | { kind: 'tools-index' }
  | { kind: 'tool'; slug: string }
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
  | {
      kind: 'writing';
      page: PageIntroduction;
      writings: Writing[];
      findings: Reference[];
      collections: ReferenceCollection[];
      pagination: ContentCollectionMeta;
    }
  | { kind: 'writing-detail'; item: Writing };
