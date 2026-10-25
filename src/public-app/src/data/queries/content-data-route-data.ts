import type {
  AboutPageCopy,
  CreditsPageContent,
  HomePageContent,
  PageIntroduction,
  Profile,
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
} from '@portfolio/data/services';
import type { ContentCollectionMeta } from '../api/public-site-source-support';

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
  | { kind: 'now'; page: Awaited<ReturnType<typeof getNowPageCopy>> }
  | ({
      kind: 'collections';
    } & ContentFeedRouteData)
  | { kind: 'collection-detail'; collection: ReferenceCollectionDetail }
  | { kind: 'contact'; page: PageIntroduction; site: SiteText }
  | { kind: 'credits'; content: CreditsPageContent }
  | { kind: 'license'; page: Awaited<ReturnType<typeof getLicensePageCopy>>; site: SiteText }
  | { kind: 'follow'; page: Awaited<ReturnType<typeof getFollowPageCopy>>; site: SiteText }
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
      pagination: ContentCollectionMeta;
    }
  | ({
      kind: 'writing';
    } & ContentFeedRouteData)
  | { kind: 'writing-detail'; item: Writing };
