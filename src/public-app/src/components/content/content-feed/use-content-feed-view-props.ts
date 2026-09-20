'use client';

import { useContentFeedSelectDefinitions } from './use-content-feed-select-definitions';
import { buildContentFeedSelectInput } from './build-content-feed-select-input';
import { buildContentFeedFormViewProps } from './build-content-feed-form-view-props';
import { buildContentFeedPaginationViewProps } from './build-content-feed-pagination-view-props';
import type { ContentFeedViewProps } from './content-feed-view';
import type { UseContentFeedViewPropsInput } from './use-content-feed-view-props.types';

export function useContentFeedViewProps(input: UseContentFeedViewPropsInput): ContentFeedViewProps {
  const selects = useContentFeedSelectDefinitions(buildContentFeedSelectInput(input));

  const viewInput = { ...input, selects };

  return {
    ...buildContentFeedFormViewProps(viewInput),
    ...buildContentFeedPaginationViewProps(viewInput),
  };
}
