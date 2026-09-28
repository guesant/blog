'use client';

import {
  ResumeEntryBlockFrame,
  ResumeEntryGridFrame,
  ResumeEntryTitle,
  ResumeRecommendationQuote,
  ResumeRecommendationRole,
} from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { RecommendationItem } from './types';
import { EntryPeriod } from './entry-period';

type RecommendationEntryProps = { item: RecommendationItem };

export function RecommendationEntry(props: RecommendationEntryProps) {
  const { item } = props;

  return (
    <ResumeEntryBlockFrame>
      <ResumeEntryGridFrame>
        <ResumeEntryTitle href={item.url}>{item.author}</ResumeEntryTitle>
        <ConditionalContent
          condition={Boolean(item.period)}
          content={<EntryPeriod period={item.period ?? ''} />}
        />
        <ResumeRecommendationRole>{item.role}</ResumeRecommendationRole>
      </ResumeEntryGridFrame>
      <ResumeRecommendationQuote>“{item.quote}”</ResumeRecommendationQuote>
    </ResumeEntryBlockFrame>
  );
}
