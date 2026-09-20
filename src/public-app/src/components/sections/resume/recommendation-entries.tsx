'use client';

import { Box } from '../../ui';
import type { RecommendationEntriesProps } from './types';
import { RecommendationEntry } from './recommendation-entry';

export function RecommendationEntries(props: RecommendationEntriesProps) {
  const { items } = props;

  return (
    <Box visualVariant="recommendationEntries">
      {items.map((item) => (
        <RecommendationEntry key={`${item.author}-${item.period}`} item={item} />
      ))}
    </Box>
  );
}
