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
  sort?: 'asc' | 'desc' | 'alpha';
  featured?: boolean;
  q?: string;
  type?: string;
  topic?: string;
  kind?: 'post' | 'achado' | 'colecao';
};

export type ContentCollectionMeta = {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  locale: ContentLocale;
  facets?: FindingFacets;
};

export type ContentCollectionPage<T> = {
  items: T[];
  meta: ContentCollectionMeta;
};

export type FindingFacets = {
  types: string[];
  ratings: string[];
  consumptionStates: string[];
  years: string[];
  topics: { slug: string; name: string }[];
};
