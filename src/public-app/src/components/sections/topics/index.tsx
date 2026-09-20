'use client';

import type { Topic } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { AchadosIndexLayout } from '../../content/achados-index-layout';
import { ListingView } from '../../content/listing-view';
import { TopicListItem } from './topic-list-item';

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
      <ListingView
        items={topics}
        getKey={(item) => item.slug}
        renderListItem={(topic) => <TopicListItem topic={topic} t={tPages} />}
      />
    </AchadosIndexLayout>
  );
}
