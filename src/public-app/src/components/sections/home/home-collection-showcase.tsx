import type { HomeCollectionShowcase as HomeCollectionShowcaseData } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeGalleryOptionalSection } from './home-gallery-optional-section';

type HomeCollectionShowcaseProps = {
  showcase: HomeCollectionShowcaseData;
  t: Translator;
};

export function HomeCollectionShowcase(props: HomeCollectionShowcaseProps) {
  return (
    <HomeGalleryOptionalSection
      id={`collection-${props.showcase.collection.slug}`}
      title={props.showcase.collection.title}
      action={props.t('viewCollection')}
      href={props.showcase.collection.href}
      entries={props.showcase.items}
      mode="carousel"
      t={props.t}
    />
  );
}
