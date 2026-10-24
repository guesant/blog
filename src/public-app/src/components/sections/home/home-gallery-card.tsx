import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { CatalogFeedCard } from '../../content/catalog-feed-card';

type HomeGalleryCardProps = {
  entry: HomeGalleryEntry;
  t: HomeTranslator;
};

export function HomeGalleryCard(props: HomeGalleryCardProps) {
  return <CatalogFeedCard entry={props.entry} t={props.t} />;
}
