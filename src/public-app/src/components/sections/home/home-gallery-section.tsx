import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { ContentSection } from '../../content/content-section';
import { HomeGalleryCards } from './home-gallery-cards';
import { HomeGalleryRow } from './ui/home-gallery-row';
import { HomeGallerySectionAction } from './ui/home-gallery-section-action';

type HomeGallerySectionProps = {
  id: string;
  title: string;
  action: string;
  href: string;
  entries: HomeGalleryEntry[];
  total?: number;
  mode?: 'carousel' | 'list';
  t: HomeTranslator;
};

export function HomeGallerySection(props: HomeGallerySectionProps) {
  const total = props.total ?? props.entries.length;

  const summary =
    total > props.entries.length
      ? props.t('showing', { visible: props.entries.length, total })
      : undefined;

  return (
    <ContentSection
      id={props.id}
      title={props.title}
      description={summary}
      footer={<HomeGallerySectionAction action={props.action} href={props.href} />}
    >
      <HomeGalleryRow mode={props.mode}>
        <HomeGalleryCards entries={props.entries} t={props.t} />
      </HomeGalleryRow>
    </ContentSection>
  );
}
