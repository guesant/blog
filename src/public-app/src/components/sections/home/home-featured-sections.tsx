import type { HomePageContent } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeProjectsSection } from './home-projects-section';
import { HomeWorkSection } from './home-work-section';

type HomeFeaturedSectionsProps = {
  content: HomePageContent;
  t: Translator;
};

export function HomeFeaturedSections(props: HomeFeaturedSectionsProps) {
  return (
    <>
      {props.content.cases.length > 0 && (
        <HomeWorkSection
          cases={props.content.cases}
          casesPagination={props.content.casesPagination}
          page={props.content.page}
          t={props.t}
        />
      )}
      {(props.content.projects.length > 0 || props.content.experimentsCount > 0) && (
        <HomeProjectsSection
          projects={props.content.projects}
          projectsPagination={props.content.projectsPagination}
          experimentsCount={props.content.experimentsCount}
          page={props.content.page}
          t={props.t}
        />
      )}
    </>
  );
}
