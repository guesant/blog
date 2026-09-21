'use client';

import type { Topic } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { AchadosIndexLayout } from '../../content/achados-index-layout';
import { CollectionListing } from '../../content/collection-listing';
import { TopicListItem } from './topic-list-item';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type TopicosPageContentProps = { topics: Topic[]; pagination: ContentCollectionMeta };

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
      <CollectionListing
        items={topics}
        getKey={(item) => item.slug}
        renderListItem={(topic) => <TopicListItem topic={topic} t={tPages} />}
        pagination={{ meta: props.pagination, action: '/topics' }}
      />
    </AchadosIndexLayout>
  );
}
