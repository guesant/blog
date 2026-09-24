import type { HomeGallery } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeCollectionShowcases } from './home-collection-showcases';
import { HomePortfolioSections } from './home-portfolio-sections';

type HomeEditorialGallerySecondaryProps = {
  gallery: HomeGallery;
  t: Translator;
};

export function HomeEditorialGallerySecondary(props: HomeEditorialGallerySecondaryProps) {
  return (
    <>
      <HomePortfolioSections portfolio={props.gallery.portfolio} t={props.t} />
      <HomeCollectionShowcases showcases={props.gallery.collectionShowcases} t={props.t} />
    </>
  );
}
