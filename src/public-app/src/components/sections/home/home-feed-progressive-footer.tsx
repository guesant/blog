import type { useHomeFeedProgressive } from './use-home-feed-progressive';
import { ProgressiveCollectionSkeleton } from '../../content/progressive-collection/progressive-collection-skeleton';

type HomeFeedProgressiveFooterProps = {
  progressive: ReturnType<typeof useHomeFeedProgressive>;
};

export function HomeFeedProgressiveFooter(props: HomeFeedProgressiveFooterProps) {
  if (!props.progressive.isFetching || props.progressive.isError) {
    return null;
  }

  return <ProgressiveCollectionSkeleton />;
}
