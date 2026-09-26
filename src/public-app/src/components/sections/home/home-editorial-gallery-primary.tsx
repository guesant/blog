import type { HomeGallery } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { HomeGalleryFeedSections } from './home-gallery-feed-sections';
import { HomeGalleryOptionalSection } from './home-gallery-optional-section';

type HomeEditorialGalleryPrimaryProps = {
  gallery: HomeGallery;
  t: HomeTranslator;
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
        total={props.gallery.totals.highlights}
        mode="carousel"
        t={props.t}
      />
      <HomeGalleryFeedSections
        recent={props.gallery.recent}
        popular={props.gallery.popular}
        totals={props.gallery.totals}
        t={props.t}
      />
    </>
  );
}
