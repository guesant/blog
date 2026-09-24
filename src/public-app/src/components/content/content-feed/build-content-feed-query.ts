import type { ContentFeedDisplayMode, FeedQuickFilter, SortMode } from './types';
import { contentFeedQueryKind } from './content-feed-query-kind';
import { contentFeedQuerySort } from './content-feed-query-sort';
import { resolveContentFeedKind } from './resolve-content-feed-kind';
import { setContentFeedOptionalQueryParams } from './set-content-feed-optional-query-params';
import { setQueryParameter } from './set-query-parameter';

export type BuildContentFeedQueryProps = {
  fixedKind?: string;
  kind: string;
  topic: string;
  type: string;
  search: string;
  sort: SortMode;
  displayMode?: ContentFeedDisplayMode;
  perPage?: number;
  page?: number;
  filter?: FeedQuickFilter;
};

export function buildContentFeedQuery(props: BuildContentFeedQueryProps) {
  const nextKind = resolveContentFeedKind({
    fixedKind: props.fixedKind,
    filterKind: props.filter?.kind,
    filterType: props.filter?.type,
    kind: props.kind,
  });

  const nextType = props.filter?.type ?? props.type;

  const search = props.search.trim();

  const params = new URLSearchParams();

  const values = {
    kind: contentFeedQueryKind({ fixedKind: props.fixedKind, kind: nextKind }),
    topic: props.topic,
    type: nextType,
    q: search,
    sort: contentFeedQuerySort(props.sort),
  };

  Object.entries(values).forEach(([key, value]) => setQueryParameter(params, key, value));

  setContentFeedOptionalQueryParams(params, props);

  return { params, nextKind, nextType };
}
