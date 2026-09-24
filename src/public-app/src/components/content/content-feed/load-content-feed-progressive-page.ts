import { getHomeFeedPage } from '@portfolio/data/services';
import { collectionQuery } from '../../../data/queries/content-data-collection-query';
import { buildContentFeedQuery } from './build-content-feed-query';
import type { ContentFeedProgressiveProps } from './use-content-feed-progressive.types';

export function loadContentFeedProgressivePage(props: ContentFeedProgressiveProps, page: number) {
  const { params } = buildContentFeedQuery({
    fixedKind: props.fixedKind,
    kind: props.kind,
    topic: props.topic,
    type: props.type,
    search: props.search,
    sort: props.sort,
    page,
    perPage: props.perPage,
  });

  return getHomeFeedPage(props.locale, collectionQuery(params.toString(), 'page', props.perPage));
}
