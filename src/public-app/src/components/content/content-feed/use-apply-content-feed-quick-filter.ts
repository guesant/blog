import { useCallback } from 'react';
import { buildContentFeedQuery } from './build-content-feed-query';
import type { FeedQuickFilter } from './types';
import type { ContentFeedActionProps } from './use-content-feed-actions.types';

type UseApplyContentFeedQuickFilterProps = Pick<
  ContentFeedActionProps,
  | 'action'
  | 'fixedKind'
  | 'kind'
  | 'topic'
  | 'type'
  | 'pendingSearch'
  | 'sort'
  | 'router'
  | 'setKind'
  | 'setType'
  | 'displayMode'
  | 'perPage'
> & {
  scrollToFeedAfter: (navigation: Promise<unknown>) => void;
};

export function useApplyContentFeedQuickFilter(props: UseApplyContentFeedQuickFilterProps) {
  return useCallback(
    (filter: FeedQuickFilter) => {
      const { params, nextKind, nextType } = buildContentFeedQuery({
        fixedKind: props.fixedKind,
        kind: props.kind,
        topic: props.topic,
        type: props.type,
        search: props.pendingSearch,
        sort: props.sort,
        displayMode: props.displayMode,
        perPage: props.perPage,
        filter,
      });

      props.setKind(nextKind);
      props.setType(nextType);

      const href = `${props.action}${params.size ? `?${params.toString()}` : ''}`;

      props.scrollToFeedAfter(props.router.push(href, { resetScroll: false }));
    },
    [props],
  );
}
