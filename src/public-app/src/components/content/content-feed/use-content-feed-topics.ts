'use client';

import { useMemo } from 'react';
import { buildFeedTopics } from './build-feed-topics';

export function useContentFeedTopics() {
  return useMemo(() => buildFeedTopics({ topics: [] }), []);
}
