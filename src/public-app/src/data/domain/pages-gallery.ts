import type { PublicFeedItem } from './content';

export type HomeGalleryEntryKind = 'writing' | 'collection' | 'credits';

export type HomeGalleryEntry = Record<string, unknown> & {
  kind: HomeGalleryEntryKind;
  slug: string;
  title: string;
  description: string;
  href: string;
  category?: string;
  date?: string;
};

export type HomeCollectionShowcase = {
  collection: HomeGalleryEntry;
  items: HomeGalleryEntry[];
};

export type HomeGalleryTotals = {
  feed: number;
  collectionShowcases: number;
};

export type HomeGallery = {
  feed: PublicFeedItem[];
  collectionShowcases: HomeCollectionShowcase[];
  totals: HomeGalleryTotals;
};
