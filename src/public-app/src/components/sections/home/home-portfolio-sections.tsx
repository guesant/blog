import type { HomeGalleryPortfolio } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeGalleryOptionalSection } from './home-gallery-optional-section';
import { homePortfolioSectionTemplates } from './home-portfolio-section-templates';

type HomePortfolioSectionsProps = {
  portfolio: HomeGalleryPortfolio;
  t: Translator;
};

export function HomePortfolioSections(props: HomePortfolioSectionsProps) {
  const sections = homePortfolioSectionTemplates.map((section) => ({
    ...section,
    entries: props.portfolio[section.key],
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
          mode={section.key === 'credits' ? 'list' : 'carousel'}
          t={props.t}
        />
      ))}
    </>
  );
}
