'use client';

import type { Topic } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { ContentSection } from '../../content/content-section';
import { CollectionListing } from '../../content/collection-listing';
import { TopicListItem } from './topic-list-item';
import { TopicsEmptyState } from './topics-empty-state';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type TopicosPageContentProps = { topics: Topic[]; pagination: ContentCollectionMeta };

export function TopicosPageContent(props: TopicosPageContentProps) {
  const { topics } = props;

  const t = useTranslations('Common');

  const tPages = useTranslations('Pages.topics');

  return (
    <ContentSection title={tPages('indexTitle')} description={tPages('indexDescription')}>
      {topics.length === 0 ? (
        <TopicsEmptyState />
      ) : (
        <CollectionListing
          items={topics}
          getKey={(item) => item.slug}
          renderListItem={(topic) => <TopicListItem topic={topic} t={t} />}
          pagination={{ meta: props.pagination, action: '/topics' }}
        />
      )}
    </ContentSection>
  );
}
