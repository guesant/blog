import { ConditionalContent } from '../../primitives/conditional-content';
import { ProgressiveCollectionFooter } from '../progressive-collection/progressive-collection-footer';
import type { ContentFeedListingProps } from './content-feed-listing';

type ContentFeedListingProgressiveProps = Pick<
  ContentFeedListingProps,
  'displayMode' | 'progressive'
>;

export function ContentFeedListingProgressive(props: ContentFeedListingProgressiveProps) {
  return (
    <ConditionalContent
      condition={props.displayMode === 'infinite'}
      content={<ProgressiveCollectionFooter progressive={props.progressive} />}
    />
  );
}
