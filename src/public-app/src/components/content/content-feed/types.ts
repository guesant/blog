import type {
  PublicFeedItem,
  Reference,
  ReferenceCollection,
  Writing,
} from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';
import type { FindingFacets, FindingListMeta } from '@portfolio/data/services';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import type { SourcePreviewData } from '../source-preview/types';

type FeedKind = 'post' | 'achado' | 'colecao';

export type SortMode = 'desc' | 'asc' | 'alpha' | 'popular';

export type FeedQuickFilter = {
  kind?: FeedKind;
  type?: string;
};

export type FeedEntry = {
  kind: FeedKind;
  slug: string;
  title: string;
  preview: string;
  date: string;
  readingTime?: string;
  topics: { name: string; slug?: string; url?: string }[];
  findingType?: string;
  popularityRank?: number;
  popularityLabel?: string;
  featured?: boolean;
  sourcePreviews?: SourcePreviewData[];
  href: string;
};

export type FeedPageCopy = { title: string; description: string };

export type ContentFeedProps = {
  feedItems?: PublicFeedItem[];
  writings: Writing[];
  findings: Reference[];
  collections: ReferenceCollection[];
  copy: FeedPageCopy;
  showHeader?: boolean;
  showPagination?: boolean;
  fixedKind?: FeedKind;
  action: string;
  initialKind?: string;
  initialTopic?: string;
  initialSearch?: string;
  initialSort?: SortMode;
  initialType?: string;
  initialPage?: number;
  findingsMeta?: FindingListMeta;
  findingFacets?: FindingFacets;
  contentMeta?: ContentCollectionMeta;
  beforeExplore?: ReactNode;
};
