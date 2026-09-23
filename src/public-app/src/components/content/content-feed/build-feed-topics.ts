import type { FindingFacets } from '@portfolio/data/services';

type BuildFeedTopicsProps = {
  findingFacets?: FindingFacets;
};

export function buildFeedTopics(props: BuildFeedTopicsProps) {
  return props.findingFacets?.topics ?? [];
}
