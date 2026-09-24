import type { ContentCollectionMeta } from '../../../data/api/public-site-source-support';
import type { ContentFeedProgressiveProps } from './use-content-feed-progressive.types';

export function buildContentFeedProgressiveMeta(
  props: ContentFeedProgressiveProps,
): ContentCollectionMeta {
  return {
    page: 1,
    perPage: props.perPage,
    total: props.feedItems?.length ?? 0,
    lastPage: 1,
    locale: props.locale === 'pt-BR' ? 'pt-BR' : 'en',
  };
}
