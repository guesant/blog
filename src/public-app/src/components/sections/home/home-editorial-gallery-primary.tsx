import type { HomeGallery } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeGalleryOptionalSection } from './home-gallery-optional-section';

type HomeEditorialGalleryPrimaryProps = {
  gallery: HomeGallery;
  t: Translator;
};

export function HomeEditorialGalleryPrimary(props: HomeEditorialGalleryPrimaryProps) {
  return (
    <>
      <HomeGalleryOptionalSection
        id="highlights"
        title={props.t('highlights')}
        action={props.t('viewHighlights')}
        href="/portfolio"
        entries={props.gallery.highlights}
        mode="carousel"
        t={props.t}
      />
      <HomeGalleryOptionalSection
        id="recent"
        title={props.t('recent')}
        action={props.t('viewRecent')}
        href="/feed"
        entries={props.gallery.recent}
        t={props.t}
      />
      <HomeGalleryOptionalSection
        id="popular"
        title={props.t('popular')}
        action={props.t('viewPopular')}
        href="/findings?sort=popular"
        entries={props.gallery.popular}
        t={props.t}
      />
    </>
  );
}
