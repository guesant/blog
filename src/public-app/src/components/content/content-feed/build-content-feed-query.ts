import type { FeedQuickFilter, SortMode } from './types';
import { contentFeedQueryKind } from './content-feed-query-kind';
import { contentFeedQuerySort } from './content-feed-query-sort';
import { resolveContentFeedKind } from './resolve-content-feed-kind';
import { setContentFeedOptionalQueryParams } from './set-content-feed-optional-query-params';
import { setQueryParameter } from './set-query-parameter';

export type BuildContentFeedQueryProps = {
  fixedKind?: string;
  kind: string;
  topic: string;
  search: string;
  sort: SortMode;
  page?: number;
  filter?: FeedQuickFilter;
};

export function buildContentFeedQuery(props: BuildContentFeedQueryProps) {
  const nextKind = resolveContentFeedKind({
    fixedKind: props.fixedKind,
    filterKind: props.filter?.kind,
    kind: props.kind,
  });

  const search = props.search.trim();

  const params = new URLSearchParams();

  const values = {
    kind: contentFeedQueryKind({ fixedKind: props.fixedKind, kind: nextKind }),
    topic: props.topic,
    q: search,
    sort: contentFeedQuerySort(props.sort),
  };

  Object.entries(values).forEach(([key, value]) => setQueryParameter(params, key, value));

  setContentFeedOptionalQueryParams(params, props);

  return { params, nextKind };
}
