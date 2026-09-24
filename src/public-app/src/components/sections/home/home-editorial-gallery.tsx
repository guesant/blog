import type { HomeGallery } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeEditorialGalleryPrimary } from './home-editorial-gallery-primary';
import { HomeEditorialGallerySecondary } from './home-editorial-gallery-secondary';

type HomeEditorialGalleryProps = {
  gallery: HomeGallery;
  t: Translator;
};

export function HomeEditorialGallery(props: HomeEditorialGalleryProps) {
  return (
    <>
      <HomeEditorialGalleryPrimary gallery={props.gallery} t={props.t} />
      <HomeEditorialGallerySecondary gallery={props.gallery} t={props.t} />
    </>
  );
}
