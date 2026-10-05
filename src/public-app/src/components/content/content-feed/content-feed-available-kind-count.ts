import type { ContentFeedProps } from './types';

type ContentFeedAvailableKindCountProps = Pick<ContentFeedProps, 'feedItems'>;

export function contentFeedAvailableKindCount(props: ContentFeedAvailableKindCountProps): number {
  return new Set(props.feedItems.map((item) => item.kind)).size;
}
