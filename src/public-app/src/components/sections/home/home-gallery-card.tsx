import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeGalleryCatalogCard } from './home-gallery-catalog-card';
import { HomeGalleryFindingCard } from './home-gallery-finding-card';

type HomeGalleryCardProps = {
  entry: HomeGalleryEntry;
  t: Translator;
};

export function HomeGalleryCard(props: HomeGalleryCardProps) {
  if (props.entry.kind === 'finding') {
    return <HomeGalleryFindingCard entry={props.entry} t={props.t} />;
  }

  return <HomeGalleryCatalogCard entry={props.entry} t={props.t} />;
}
