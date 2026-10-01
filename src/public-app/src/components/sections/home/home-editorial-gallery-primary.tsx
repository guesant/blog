import type { HomeGallery, PublicFeedItem } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { HomeTranslator } from '@/i18n/compat-support';
import { HomeFeedSection } from './home-feed-section';
import { HomeGalleryOptionalSection } from './home-gallery-optional-section';

type HomeEditorialGalleryPrimaryProps = {
  gallery: HomeGallery;
  feedItems: PublicFeedItem[];
  feedPagination: ContentCollectionMeta;
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
      <ConditionalContent
        condition={props.gallery.totals.feed > 0}
        content={<HomeFeedSection items={props.feedItems} pagination={props.feedPagination} />}
      />
    </>
  );
}
