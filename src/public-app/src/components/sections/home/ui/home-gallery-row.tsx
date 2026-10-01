import type { ReactNode } from 'react';
import { HomeGalleryCarouselRow } from './home-gallery-carousel-row';
import { HomeGalleryListRow } from './home-gallery-list-row';

type HomeGalleryRowProps = {
  children: ReactNode;
  mode?: 'carousel' | 'list';
};

export function HomeGalleryRow(props: HomeGalleryRowProps) {
  if (props.mode === 'carousel') {
    return <HomeGalleryCarouselRow children={props.children} />;
  }

  return <HomeGalleryListRow children={props.children} />;
}
