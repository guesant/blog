import type { InterfaceMessages, Reference } from '../domain/types.ts';
import { AsyncLocalStorage } from 'node:async_hooks';
import type { ProtectedEmailChallenge } from '../domain/protected-email/types.ts';

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

export type Snapshot = RecordValue & {
  chrome: RecordValue;
  pages: Record<string, RecordValue>;
  interface: InterfaceMessages;
};

export type SnapshotContext = { locale: ContentLocale; snapshot: Snapshot };

export type SnapshotRequest = { expiresAt: number; promise: Promise<Snapshot> };

export type EmailChallengeRequest = {
  expiresAt: number;
  promise: Promise<ProtectedEmailChallenge | undefined>;
};

export const snapshotContext = new AsyncLocalStorage<SnapshotContext>();

export const snapshotRequests = new Map<ContentLocale, SnapshotRequest>();

export const snapshotRequestTtlMs = 60000;

export const emailChallengeState: { current: EmailChallengeRequest | undefined } = {
  current: undefined,
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
