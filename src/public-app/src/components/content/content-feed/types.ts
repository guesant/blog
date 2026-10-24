import type { PublicFeedItem } from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import type { BreadcrumbItem } from '../../navigation/breadcrumbs';

type FeedKind = 'post' | 'colecao';

export type SortMode = 'desc' | 'asc' | 'alpha';

export type FeedQuickFilter = {
  kind?: FeedKind;
};

export type FeedEntry = {
  kind: FeedKind;
  slug: string;
  title: string;
  preview: string;
  date: string;
  readingTime?: string;
  topics: { name: string; slug?: string; url?: string }[];
  href: string;
};

export type FeedPageCopy = { title: string; description: string };

export type ContentFeedProps = {
  feedItems: PublicFeedItem[];
  copy: FeedPageCopy;
  searchPlaceholder?: string;
  breadcrumbs?: BreadcrumbItem[];
  showHeader?: boolean;
  showPagination?: boolean;
  fixedKind?: FeedKind;
  action: string;
  initialKind?: string;
  initialTopic?: string;
  initialSearch?: string;
  initialSort?: SortMode;
  showSelects?: boolean;
  initialPage?: number;
  contentMeta?: ContentCollectionMeta;
  beforeExplore?: ReactNode;
};
