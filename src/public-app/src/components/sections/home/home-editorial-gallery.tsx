import type { HomeGallery, PublicFeedItem } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import type { HomeTranslator } from '@/i18n/compat-support';
import { HomeEditorialGalleryPrimary } from './home-editorial-gallery-primary';
import { HomeEditorialGallerySecondary } from './home-editorial-gallery-secondary';

type HomeEditorialGalleryProps = {
  gallery: HomeGallery;
  feedItems: PublicFeedItem[];
  feedPagination: ContentCollectionMeta;
  t: HomeTranslator;
};

export function HomeEditorialGallery(props: HomeEditorialGalleryProps) {
  return (
    <>
      <HomeEditorialGalleryPrimary
        gallery={props.gallery}
        feedItems={props.feedItems}
        feedPagination={props.feedPagination}
        t={props.t}
      />
      <HomeEditorialGallerySecondary gallery={props.gallery} t={props.t} />
    </>
  );
}
