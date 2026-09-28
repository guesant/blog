'use client';

import { ResumeRecommendationListFrame } from '../../ui';
import type { RecommendationEntriesProps } from './types';
import { RecommendationEntry } from './recommendation-entry';

export function RecommendationEntries(props: RecommendationEntriesProps) {
  const { items } = props;

  return (
    <ResumeRecommendationListFrame>
      {items.map((item) => (
        <RecommendationEntry key={`${item.author}-${item.period}`} item={item} />
      ))}
    </ResumeRecommendationListFrame>
  );
}
