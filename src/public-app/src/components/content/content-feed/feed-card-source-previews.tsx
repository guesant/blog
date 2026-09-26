import { ConditionalContent } from '../../primitives/conditional-content';
import { SourcePreviewListGroup } from '../source-preview/source-preview-list-group';
import { handleSourceKindClick } from './handle-source-kind-click';
import type { FeedCardProps } from './feed-card-types';

type FeedCardSourcePreviewsProps = Pick<
  FeedCardProps,
  'entry' | 'onQuickFilter' | 'showSourcePreviews'
>;

export function FeedCardSourcePreviews(props: FeedCardSourcePreviewsProps) {
  const onKindClick = props.onQuickFilter
    ? handleSourceKindClick.bind(null, props.onQuickFilter)
    : undefined;

  return (
    <ConditionalContent
      condition={props.showSourcePreviews !== false && Boolean(props.entry.sourcePreviews?.length)}
      content={
        <SourcePreviewListGroup
          entries={props.entry.sourcePreviews ?? []}
          onKindClick={onKindClick}
        />
      }
    />
  );
}
