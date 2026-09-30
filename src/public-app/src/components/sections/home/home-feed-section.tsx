'use client';

import type { PublicFeedItem } from '@portfolio/data/domain/types';
import { useLocale, useTranslations } from '@/i18n/compat';
import { CollectionListing } from '../../content/collection-listing';
import { buildFeedItemEntry } from '../../content/content-feed/build-feed-item-entry';
import { FeedCard } from '../../content/content-feed/feed-card';
import { useSiteFeatureFlags } from '../../content/use-site-feature-flags';
import { ContentSection } from '../../content/content-section';
import type { HomeTranslator } from '@/i18n/compat-support';
import { HomeGallerySectionAction } from './ui/home-gallery-section-action';

type HomeFeedSectionProps = {
  items: PublicFeedItem[];
  total: number;
  t: HomeTranslator;
};

export function HomeFeedSection(props: HomeFeedSectionProps) {
  const locale = useLocale();

  const tFeed = useTranslations('Pages.achados');

  const { feed } = useSiteFeatureFlags();

  const entries = props.items.map(buildFeedItemEntry);

  const summary =
    props.total > entries.length
      ? props.t('showing', { visible: entries.length, total: props.total })
      : undefined;

  return (
    <ContentSection
      id="feed"
      title={props.t('feed')}
      description={summary}
      divider
      sectionGap="var(--site-page-content-offset)"
      footer={<HomeGallerySectionAction action={props.t('viewFeed')} href="/feed" />}
    >
      <CollectionListing
        items={entries}
        getKey={(entry) => `${entry.kind}-${entry.slug}`}
        renderListItem={(entry) => (
          <FeedCard entry={entry} locale={locale} t={tFeed} flatCards={feed.flatCards} />
        )}
      />
    </ContentSection>
  );
}
