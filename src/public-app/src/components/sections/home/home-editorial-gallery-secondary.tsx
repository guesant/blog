import type { HomeGallery } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeGalleryOptionalSection } from './home-gallery-optional-section';

type HomeEditorialGallerySecondaryProps = {
  gallery: HomeGallery;
  t: Translator;
};

export function HomeEditorialGallerySecondary(props: HomeEditorialGallerySecondaryProps) {
  return (
    <>
      <HomeGalleryOptionalSection
        id="collections"
        title={props.t('collections')}
        action={props.t('viewCollections')}
        href="/collections"
        entries={props.gallery.collections}
        mode="carousel"
        t={props.t}
      />
      <HomeGalleryOptionalSection
        id="projects"
        title={props.t('projects')}
        action={props.t('viewProjects')}
        href="/projects"
        entries={props.gallery.projects}
        t={props.t}
      />
    </>
  );
}
