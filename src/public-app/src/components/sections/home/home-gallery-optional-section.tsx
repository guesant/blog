import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { ConditionalContent } from '../../primitives/conditional-content';
import { HomeGallerySection } from './home-gallery-section';

type HomeGalleryOptionalSectionProps = {
  id: string;
  title: string;
  action: string;
  href: string;
  entries: HomeGalleryEntry[];
  mode?: 'grid' | 'carousel';
  t: Translator;
};

export function HomeGalleryOptionalSection(props: HomeGalleryOptionalSectionProps) {
  return (
    <ConditionalContent
      condition={props.entries.length > 0}
      content={<HomeGallerySection {...props} />}
    />
  );
}
