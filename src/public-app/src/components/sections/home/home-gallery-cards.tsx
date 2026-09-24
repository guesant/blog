import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeGalleryCard } from './home-gallery-card';

type HomeGalleryCardsProps = {
  entries: HomeGalleryEntry[];
  t: Translator;
};

export function HomeGalleryCards(props: HomeGalleryCardsProps) {
  return (
    <>
      {props.entries.map((entry) => (
        <HomeGalleryCard key={`${entry.kind}-${entry.slug}`} entry={entry} t={props.t} />
      ))}
    </>
  );
}
