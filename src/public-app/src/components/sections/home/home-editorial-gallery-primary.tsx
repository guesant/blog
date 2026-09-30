import type { HomeGallery } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { HomeFeedSection } from './home-feed-section';
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
      <HomeFeedSection items={props.gallery.feed} total={props.gallery.totals.feed} t={props.t} />
    </>
  );
}
