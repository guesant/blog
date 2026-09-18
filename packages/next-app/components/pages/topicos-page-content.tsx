'use client';

import Box from '@mui/material/Box';
import type { Topic } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { AchadosIndexLayout } from '../content/achados-index-layout';
import { TopicChip } from '../content/topic-chip';

type TopicosPageContentProps = { topics: Topic[] };

export function TopicosPageContent(props: TopicosPageContentProps) {
  const { topics } = props;
  const t = useTranslations('Common');
  const tPages = useTranslations('Pages.topics');

  return (
    <AchadosIndexLayout
      title={tPages('indexTitle')}
      description={tPages('indexDescription')}
      emptyMessage={t('emptyTopics')}
      isEmpty={topics.length === 0}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: { xs: 9, md: 11 } }}>
        {topics.map((topic) => (
          <TopicChip key={topic.slug} slug={topic.slug} name={topic.name} />
        ))}
      </Box>
    </AchadosIndexLayout>
  );
}
