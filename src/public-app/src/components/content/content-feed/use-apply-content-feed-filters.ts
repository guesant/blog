import type { FormEvent } from 'react';
import { useCallback } from 'react';
import { buildContentFeedQuery } from './build-content-feed-query';
import type { ContentFeedActionProps } from './use-content-feed-actions.types';

type UseApplyContentFeedFiltersProps = Pick<
  ContentFeedActionProps,
  | 'action'
  | 'fixedKind'
  | 'kind'
  | 'topic'
  | 'type'
  | 'pendingSearch'
  | 'sort'
  | 'router'
  | 'setSearch'
> & {
  scrollToFeedAfter: (navigation: Promise<unknown>) => void;
};

export function useApplyContentFeedFilters(props: UseApplyContentFeedFiltersProps) {
  return useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { params } = buildContentFeedQuery({
        fixedKind: props.fixedKind,
        kind: props.kind,
        topic: props.topic,
        type: props.type,
        search: props.pendingSearch,
        sort: props.sort,
      });

      const href = `${props.action}${params.size ? `?${params.toString()}` : ''}`;

      const navigation = props.router.push(href, { resetScroll: false });

      props.setSearch(props.pendingSearch.trim());
      props.scrollToFeedAfter(navigation);
    },
    [props],
  );
}
