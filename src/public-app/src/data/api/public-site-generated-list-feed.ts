import { publicSiteApiFeed } from './generated/sdk.gen';
import type { Options } from './generated/sdk.gen';
import type {
  PublicSiteApiFeedData,
  PublicSiteApiFeedErrors,
  PublicSiteApiFeedResponses,
} from './generated/types.gen';
import type { RequestResult } from './generated/client';

type ListPublicFeedQuery = {
  locale?: string;
  page?: number;
  per_page?: number;
  sort?: string;
  q?: string;
  type?: string;
  topic?: string;
  kind?: 'post' | 'achado' | 'colecao';
};

export type ListPublicFeedData = {
  body?: never;
  path?: never;
  query?: ListPublicFeedQuery;
  url: '/content/feed';
};

export function listPublicFeed<ThrowOnError extends boolean = false>(
  options: Options<ListPublicFeedData, ThrowOnError>,
): RequestResult<PublicSiteApiFeedResponses, PublicSiteApiFeedErrors, ThrowOnError> {
  return publicSiteApiFeed(options as Options<PublicSiteApiFeedData, ThrowOnError>);
}
