import type { HomeGalleryFeedCategories } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeGalleryOptionalSection } from './home-gallery-optional-section';
import { homeGalleryFeedSectionTemplates } from './home-gallery-feed-section-templates';

export type HomeGalleryFeedSectionsProps = {
  recent: HomeGalleryFeedCategories;
  popular: HomeGalleryFeedCategories;
  t: Translator;
};

type HomeGalleryFeedSection = {
  id: string;
  titleKey: string;
  actionKey: string;
  href: string;
  entries: HomeGalleryFeedCategories[keyof HomeGalleryFeedCategories];
  mode: 'grid' | 'list';
};

export function HomeGalleryFeedSections(props: HomeGalleryFeedSectionsProps) {
  const sections: HomeGalleryFeedSection[] = homeGalleryFeedSectionTemplates.map((section) => ({
    ...section,
    entries: props[section.source][section.kind],
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
          mode={section.mode}
          t={props.t}
        />
      ))}
    </>
  );
}
