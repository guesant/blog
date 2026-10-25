import type { HomeGallery } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { HomeCollectionShowcases } from './home-collection-showcases';

type HomeEditorialGallerySecondaryProps = {
  gallery: HomeGallery;
  t: HomeTranslator;
};

export function HomeEditorialGallerySecondary(props: HomeEditorialGallerySecondaryProps) {
  return (
    <>
      <HomeCollectionShowcases showcases={props.gallery.collectionShowcases} t={props.t} />
    </>
  );
}
