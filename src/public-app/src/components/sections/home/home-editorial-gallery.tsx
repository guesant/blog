import type { HomeGallery } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeEditorialGalleryPrimary } from './home-editorial-gallery-primary';
import { HomeEditorialGallerySecondary } from './home-editorial-gallery-secondary';
import { HomeGallerySections } from './ui/home-gallery-sections';

type HomeEditorialGalleryProps = {
  gallery: HomeGallery;
  t: Translator;
};

export function HomeEditorialGallery(props: HomeEditorialGalleryProps) {
  return (
    <HomeGallerySections>
      <HomeEditorialGalleryPrimary gallery={props.gallery} t={props.t} />
      <HomeEditorialGallerySecondary gallery={props.gallery} t={props.t} />
    </HomeGallerySections>
  );
}
