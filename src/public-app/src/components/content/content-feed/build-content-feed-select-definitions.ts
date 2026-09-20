import type { FeedSelectDefinition } from './feed-select.types';
import {
  contentFeedSelectBuilders,
  type ContentFeedSelectBuilderProps,
} from './build-content-feed-select-builders';

export function buildContentFeedSelectDefinitions(
  props: ContentFeedSelectBuilderProps,
): FeedSelectDefinition[] {
  return contentFeedSelectBuilders
    .map((builder) => builder(props))
    .filter((definition): definition is FeedSelectDefinition => definition !== undefined);
}
