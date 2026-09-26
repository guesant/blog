import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
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
  total?: number;
  mode?: 'grid' | 'carousel' | 'list';
  t: HomeTranslator;
};

export function HomeGallerySection(props: HomeGallerySectionProps) {
  const total = props.total ?? props.entries.length;

  const summary =
    total > props.entries.length
      ? props.t('showing', { visible: props.entries.length, total })
      : undefined;

  return (
    <HomeSectionSurface id={props.id}>
      <HomeGallerySectionHeader title={props.title} summary={summary} />
      <HomeGalleryRow mode={props.mode}>
        <HomeGalleryCards entries={props.entries} t={props.t} />
      </HomeGalleryRow>
      <HomeGallerySectionAction action={props.action} href={props.href} />
    </HomeSectionSurface>
  );
}
