'use client';

import { Box, Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ExternalLink } from '../../primitives/external-link';
import type { RecommendationItem } from './types';
import { ResumeEntryGrid } from './resume-entry-grid';
import { EntryPeriod } from './entry-period';

type RecommendationEntryProps = { item: RecommendationItem };

export function RecommendationEntry(props: RecommendationEntryProps) {
  const { item } = props;

  return (
    <Box>
      <ResumeEntryGrid>
        <ConditionalContent
          condition={Boolean(item.url?.trim())}
          content={
            <ExternalLink
              href={item.url ?? ''}
              visualVariant="recommendationEntry"
              children={item.author}
            />
          }
        />
        <ConditionalContent
          condition={!item.url?.trim()}
          content={<Typography visualVariant="recommendationEntry">{item.author}</Typography>}
        />
        <ConditionalContent
          condition={Boolean(item.period)}
          content={<EntryPeriod period={item.period ?? ''} />}
        />
        <Typography variant="body2" color="text.secondary" visualVariant="recommendationEntry2">
          {item.role}
        </Typography>
      </ResumeEntryGrid>
      <Typography variant="body2" visualVariant="recommendationEntry3">
        “{item.quote}”
      </Typography>
    </Box>
  );
}
