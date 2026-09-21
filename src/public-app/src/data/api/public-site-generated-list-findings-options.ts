import { findingApiIndexOptions } from './generated/@tanstack/react-query.gen';
import type { Options } from './generated/sdk.gen';
import type { FindingApiIndexData } from './generated/types.gen';
import type { ListFindingsData } from './public-site-generated-list-findings';

export function listFindingsOptions(options: Options<ListFindingsData>) {
  return findingApiIndexOptions(options as Options<FindingApiIndexData>);
}
