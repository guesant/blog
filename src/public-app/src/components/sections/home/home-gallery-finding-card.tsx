import { feedItem } from '@portfolio/data/api/public-site-source-feed-item';
import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import { useLocale } from '@/i18n/compat';
import type { Translator } from '@/i18n/compat-support';
import { buildFeedItemEntry } from '../../content/content-feed/build-feed-item-entry';
import { FeedCard } from '../../content/content-feed/feed-card';

type HomeGalleryFindingCardProps = {
  entry: HomeGalleryEntry;
  t: Translator;
};

export function HomeGalleryFindingCard(props: HomeGalleryFindingCardProps) {
  const locale = useLocale();

  const entry = buildFeedItemEntry(feedItem({ ...props.entry, kind: 'achado' }));

  return <FeedCard entry={entry} locale={locale} t={props.t} />;
}
