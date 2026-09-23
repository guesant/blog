import { publicSiteApiCollection } from './generated/sdk.gen';
import type { Options } from './generated/sdk.gen';
import type {
  PublicSiteApiCollectionData,
  PublicSiteApiCollectionErrors,
  PublicSiteApiCollectionResponses,
} from './generated/types.gen';
import type { RequestResult } from './generated/client';

type ListPublicContentQuery = {
  locale?: string;
  page?: number;
  per_page?: number;
  sort?: string;
  featured?: boolean;
  q?: string;
  type?: string;
  topic?: string;
  kind?: 'post' | 'achado' | 'colecao';
};

export type ListPublicContentData = {
  body?: never;
  path: {
    collection: string;
  };
  query?: ListPublicContentQuery;
  url: '/content/{collection}';
};

export function listPublicContent<ThrowOnError extends boolean = false>(
  options: Options<ListPublicContentData, ThrowOnError>,
): RequestResult<PublicSiteApiCollectionResponses, PublicSiteApiCollectionErrors, ThrowOnError> {
  return publicSiteApiCollection(options as Options<PublicSiteApiCollectionData, ThrowOnError>);
}
