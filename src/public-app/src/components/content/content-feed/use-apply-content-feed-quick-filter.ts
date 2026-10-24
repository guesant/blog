import { useCallback } from 'react';
import { buildContentFeedQuery } from './build-content-feed-query';
import type { FeedQuickFilter } from './types';
import type { ContentFeedActionProps } from './use-content-feed-actions.types';

type UseApplyContentFeedQuickFilterProps = Pick<
  ContentFeedActionProps,
  'action' | 'fixedKind' | 'kind' | 'topic' | 'pendingSearch' | 'sort' | 'router' | 'setKind'
>;

export function useApplyContentFeedQuickFilter(props: UseApplyContentFeedQuickFilterProps) {
  return useCallback(
    (filter: FeedQuickFilter) => {
      const { params, nextKind } = buildContentFeedQuery({
        fixedKind: props.fixedKind,
        kind: props.kind,
        topic: props.topic,
        search: props.pendingSearch,
        sort: props.sort,
        filter,
      });

      props.setKind(nextKind);

      const href = `${props.action}${params.size ? `?${params.toString()}` : ''}`;

      props.router.push(href, { resetScroll: false });
    },
    [props],
  );
}
