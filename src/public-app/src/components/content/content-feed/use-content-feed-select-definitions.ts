'use client';

import { useMemo } from 'react';
import { buildContentFeedSelectDefinitions } from './build-content-feed-select-definitions';
import type { FeedSelectDefinition } from './feed-select.types';

type UseContentFeedSelectDefinitionsProps = Parameters<typeof buildContentFeedSelectDefinitions>[0];

export function useContentFeedSelectDefinitions(
  props: UseContentFeedSelectDefinitionsProps,
): FeedSelectDefinition[] {
  return useMemo(
    () =>
      buildContentFeedSelectDefinitions({
        ...props,
      }),
    [props],
  );
}
