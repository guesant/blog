import type { FindingFacets } from '@portfolio/data/services';
import type { FeedEntry } from './types';

type BuildFeedTopicsProps = {
  entries: FeedEntry[];
  serverManaged: boolean;
  findingFacets?: FindingFacets;
};

export function buildFeedTopics(props: BuildFeedTopicsProps) {
  if (props.serverManaged) {
    return props.findingFacets?.topics ?? [];
  }

  return [
    ...new Map(
      props.entries.flatMap((entry) =>
        entry.topics.map((item) => [item.slug ?? item.name, item] as const),
      ),
    ).values(),
  ].sort((left, right) => left.name.localeCompare(right.name));
}
