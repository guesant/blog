import type { useTranslations } from '@/i18n/compat';
import type { ProjectsPageContentProps } from './types';
import { ExperimentsSection } from './experiments-section';
import { ProjectsPageResults } from './projects-page-results';

type ProjectsPageBodyProps = {
  page: ProjectsPageContentProps['page'];
  projects: ProjectsPageContentProps['projects'];
  experiments: ProjectsPageContentProps['experiments'];
  tCommon: ReturnType<typeof useTranslations>;
};

export function ProjectsPageBody(props: ProjectsPageBodyProps) {
  return (
    <>
      <ProjectsPageResults page={props.page} projects={props.projects} tCommon={props.tCommon} />
      <ExperimentsSection
        experiments={props.experiments}
        hasProjects={props.projects.length > 0}
        page={props.page}
        tCommon={props.tCommon}
      />
    </>
  );
}
