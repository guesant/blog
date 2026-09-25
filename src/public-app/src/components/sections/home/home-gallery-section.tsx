import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeSectionSurface } from './ui/home-section-surface';
import { HomeGalleryCards } from './home-gallery-cards';
import { HomeGalleryRow } from './ui/home-gallery-row';
import { HomeGallerySectionAction } from './ui/home-gallery-section-action';
import { HomeGallerySectionHeader } from './ui/home-gallery-section-header';

type HomeGallerySectionProps = {
  id: string;
  title: string;
  action: string;
  href: string;
  entries: HomeGalleryEntry[];
  mode?: 'grid' | 'carousel' | 'list';
  t: Translator;
};

export function HomeGallerySection(props: HomeGallerySectionProps) {
  return (
    <HomeSectionSurface id={props.id}>
      <HomeGallerySectionHeader title={props.title} />
      <HomeGalleryRow mode={props.mode}>
        <HomeGalleryCards entries={props.entries} t={props.t} />
      </HomeGalleryRow>
      <HomeGallerySectionAction action={props.action} href={props.href} />
    </HomeSectionSurface>
  );
}
