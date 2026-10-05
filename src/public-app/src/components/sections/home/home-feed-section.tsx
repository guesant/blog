'use client';

import type { PublicFeedItem } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { useTranslations } from '@/i18n/compat';
import { ContentFeed } from '../../content/content-feed';

type HomeFeedSectionProps = {
  items: PublicFeedItem[];
  pagination: ContentCollectionMeta;
};

export function HomeFeedSection(props: HomeFeedSectionProps) {
  const t = useTranslations('Pages.feed');

  const tHome = useTranslations('Home');

  return (
    <ContentFeed
      feedItems={props.items}
      writings={[]}
      findings={[]}
      collections={[]}
      copy={{ title: t('title'), description: t('description') }}
      searchPlaceholder={t('searchPlaceholder')}
      contentMeta={props.pagination}
      action="/"
      showSelects={false}
      paginationMode="home"
      recentLabel={tHome('recent')}
      oldestLabel={tHome('oldest')}
    />
  );
}
