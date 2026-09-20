import type { ContentFeedProps } from './types';

type BuildContentFeedFindingTypesProps = Pick<ContentFeedProps, 'findings' | 'findingFacets'> & {
  serverManaged: boolean;
};

export function buildContentFeedFindingTypes(props: BuildContentFeedFindingTypesProps): string[] {
  if (props.serverManaged) {
    return props.findingFacets?.types ?? [];
  }

  return [...new Set(props.findings.map((item) => item.type))].sort((left, right) =>
    left.localeCompare(right),
  );
}
