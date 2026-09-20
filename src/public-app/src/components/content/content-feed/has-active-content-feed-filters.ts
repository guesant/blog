import type { ContentFeedState } from './read-content-feed-state';
import { hasContentFeedValue } from './has-content-feed-value';

type HasActiveContentFeedFiltersProps = Pick<
  ContentFeedState,
  'kind' | 'topic' | 'type' | 'search' | 'sort'
> & {
  fixedKind?: string;
};

export function hasActiveContentFeedFilters(props: HasActiveContentFeedFiltersProps): boolean {
  const hasKindFilter = !props.fixedKind && props.kind !== 'all';

  const hasValueFilter = hasContentFeedValue([props.topic, props.type, props.search]);

  return hasKindFilter || hasValueFilter || props.sort !== 'desc';
}
