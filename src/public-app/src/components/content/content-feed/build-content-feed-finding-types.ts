import type { ContentFeedProps } from './types';

type BuildContentFeedFindingTypesProps = Pick<ContentFeedProps, 'findingFacets'>;

export function buildContentFeedFindingTypes(props: BuildContentFeedFindingTypesProps): string[] {
  return props.findingFacets?.types ?? [];
}
