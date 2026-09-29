import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { CatalogFeedCard } from '../../content/catalog-feed-card';
import { HomeGalleryFindingCard } from './home-gallery-finding-card';

type HomeGalleryCardProps = {
  entry: HomeGalleryEntry;
  t: HomeTranslator;
};

export function HomeGalleryCard(props: HomeGalleryCardProps) {
  if (props.entry.kind === 'finding') {
    return <HomeGalleryFindingCard entry={props.entry} />;
  }

  return <CatalogFeedCard entry={props.entry} t={props.t} />;
}
