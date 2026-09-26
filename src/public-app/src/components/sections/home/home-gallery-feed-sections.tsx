import type {
  HomeGalleryFeedCategories,
  HomeGallerySectionTotals,
} from '@portfolio/data/domain/types';
import type { HomeTranslator, HomeTranslationKey } from '@/i18n/compat-support';
import { HomeGalleryOptionalSection } from './home-gallery-optional-section';
import { homeGalleryFeedSectionTemplates } from './home-gallery-feed-section-templates';

export type HomeGalleryFeedSectionsProps = {
  recent: HomeGalleryFeedCategories;
  popular: HomeGalleryFeedCategories;
  totals: {
    recent: HomeGallerySectionTotals;
    popular: HomeGallerySectionTotals;
  };
  t: HomeTranslator;
};

type HomeGalleryFeedSection = {
  id: string;
  titleKey: HomeTranslationKey;
  actionKey: HomeTranslationKey;
  href: string;
  entries: HomeGalleryFeedCategories[keyof HomeGalleryFeedCategories];
  total: number;
  mode: 'grid' | 'list';
};

export function HomeGalleryFeedSections(props: HomeGalleryFeedSectionsProps) {
  const sections: HomeGalleryFeedSection[] = homeGalleryFeedSectionTemplates.map((section) => ({
    ...section,
    entries: props[section.source][section.kind],
    total: props.totals[section.source][section.kind],
  }));

  return (
    <>
      {sections.map((section) => (
        <HomeGalleryOptionalSection
          key={section.id}
          id={section.id}
          title={props.t(section.titleKey)}
          action={props.t(section.actionKey)}
          href={section.href}
          entries={section.entries}
          total={section.total}
          mode={section.mode}
          t={props.t}
        />
      ))}
    </>
  );
}
