import type { Reference } from '../domain/types.ts';

export type RecordValue = Record<string, unknown>;

export type ContentLocale = 'en' | 'pt-BR';

export type ContentCollection =
  | 'cases'
  | 'projects'
  | 'experiments'
  | 'writing'
  | 'references'
  | 'collections'
  | 'credits'
  | 'topics'
  | 'technologies'
  | 'snippets';

export type ContentCollectionQuery = {
  page?: number;
  perPage?: number;
  sort?: 'asc' | 'desc' | 'alpha' | 'popular';
  featured?: boolean;
  q?: string;
  type?: string;
  topic?: string;
};

export type ContentCollectionMeta = {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  locale: ContentLocale;
};

export type ContentCollectionPage<T> = {
  items: T[];
  meta: ContentCollectionMeta;
};

export type FindingListQuery = {
  q?: string;
  type?: string;
  topic?: string;
  rating?: string;
  consumptionState?: string;
  year?: number;
  freeOnly?: boolean;
  sort?: 'asc' | 'desc' | 'alpha' | 'popular';
  page?: number;
  perPage?: number;
};

export type FindingFacets = {
  types: string[];
  ratings: string[];
  consumptionStates: string[];
  years: string[];
  topics: { slug: string; name: string }[];
};

export type FindingListMeta = {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  locale: ContentLocale;
  facets: FindingFacets;
};

export type FindingList = { items: Reference[]; meta: FindingListMeta };
