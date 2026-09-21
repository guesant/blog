import { findingApiIndex } from './generated/sdk.gen';
import type { Options } from './generated/sdk.gen';
import type {
  FindingApiIndexData,
  FindingApiIndexErrors,
  FindingApiIndexResponses,
} from './generated/types.gen';
import type { RequestResult } from './generated/client';

type ListFindingsQuery = {
  locale?: string;
  q?: string;
  type?: string;
  topic?: string;
  rating?: string;
  consumption_state?: string;
  year?: number;
  free_only?: boolean;
  sort?: string;
  page?: number;
  per_page?: number;
};

export type ListFindingsData = {
  body?: never;
  path?: never;
  query?: ListFindingsQuery;
  url: '/findings';
};

export type ListFindingsResponse = FindingApiIndexResponses[200];

export function listFindings<ThrowOnError extends boolean = false>(
  options: Options<ListFindingsData, ThrowOnError>,
): RequestResult<FindingApiIndexResponses, FindingApiIndexErrors, ThrowOnError> {
  return findingApiIndex(options as Options<FindingApiIndexData, ThrowOnError>);
}
