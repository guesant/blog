import { useCallback } from 'react';
import type { ContentFeedActionProps } from './use-content-feed-actions.types';

type UseClearContentFeedFiltersProps = Pick<
  ContentFeedActionProps,
  | 'action'
  | 'fixedKind'
  | 'router'
  | 'setKind'
  | 'setTopic'
  | 'setType'
  | 'setSearch'
  | 'setPendingSearch'
  | 'setSort'
> & {
  scrollToFeedAfter: (navigation: Promise<unknown>) => void;
};

export function useClearContentFeedFilters(props: UseClearContentFeedFiltersProps) {
  return useCallback(() => {
    props.setKind(props.fixedKind || 'all');
    props.setTopic('');
    props.setType('');
    props.setSearch('');
    props.setPendingSearch('');
    props.setSort('desc');
    props.scrollToFeedAfter(props.router.push(props.action, { resetScroll: false }));
  }, [props]);
}
