import { feedItem } from '@portfolio/data/api/public-site-source-feed-item';
import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import { useLocale, useTranslations } from '@/i18n/compat';
import { buildFeedItemEntry } from '../../content/content-feed/build-feed-item-entry';
import { FeedCard } from '../../content/content-feed/feed-card';

type HomeGalleryFindingCardProps = {
  entry: HomeGalleryEntry;
};

export function HomeGalleryFindingCard(props: HomeGalleryFindingCardProps) {
  const locale = useLocale();

  const t = useTranslations('Pages.achados');

  const entry = buildFeedItemEntry(feedItem({ ...props.entry, kind: 'achado' }));

  return <FeedCard entry={entry} locale={locale} t={t} />;
}
