import { ConditionalContent } from '../../primitives/conditional-content';
import { SourcePreviewListGroup } from '../source-preview/source-preview-list-group';
import { handleSourceKindClick } from './handle-source-kind-click';
import type { FeedCardProps } from './feed-card-types';

type FeedCardSourcePreviewsProps = Pick<FeedCardProps, 'entry' | 'onQuickFilter'>;

export function FeedCardSourcePreviews(props: FeedCardSourcePreviewsProps) {
  return (
    <ConditionalContent
      condition={Boolean(props.entry.sourcePreviews?.length)}
      content={
        <SourcePreviewListGroup
          entries={props.entry.sourcePreviews ?? []}
          onKindClick={handleSourceKindClick.bind(null, props.onQuickFilter)}
        />
      }
    />
  );
}
