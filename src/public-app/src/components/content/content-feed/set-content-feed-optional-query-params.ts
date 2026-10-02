import { setQueryParameter } from './set-query-parameter';
import type { BuildContentFeedQueryProps } from './build-content-feed-query';

export function setContentFeedOptionalQueryParams(
  params: URLSearchParams,
  props: Pick<BuildContentFeedQueryProps, 'perPage' | 'page'>,
) {
  if (props.perPage) {
    setQueryParameter(params, 'per_page', String(props.perPage));
  }

  if (props.page && props.page > 1) {
    setQueryParameter(params, 'page', String(props.page));
  }
}
