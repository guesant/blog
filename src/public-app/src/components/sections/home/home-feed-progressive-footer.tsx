import type { useHomeFeedProgressive } from './use-home-feed-progressive';
import { ProgressiveCollectionFooter } from '../../content/progressive-collection/progressive-collection-footer';

type HomeFeedProgressiveFooterProps = {
  progressive: ReturnType<typeof useHomeFeedProgressive>;
};

export function HomeFeedProgressiveFooter(props: HomeFeedProgressiveFooterProps) {
  return <ProgressiveCollectionFooter progressive={props.progressive} />;
}
