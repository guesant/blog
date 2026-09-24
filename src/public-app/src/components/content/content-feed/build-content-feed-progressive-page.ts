import { buildContentFeedProgressiveMeta } from './build-content-feed-progressive-meta';
import type { ProgressiveContentPage } from '../../../data/queries/progressive-content-types';
import type { PublicFeedItem } from '@portfolio/data/domain/types';
import type { ContentFeedProgressiveProps } from './use-content-feed-progressive.types';

export function buildContentFeedProgressivePage(
  props: ContentFeedProgressiveProps,
): ProgressiveContentPage<PublicFeedItem> {
  return {
    items: props.feedItems ?? [],
    meta: props.contentMeta ?? buildContentFeedProgressiveMeta(props),
  };
}
