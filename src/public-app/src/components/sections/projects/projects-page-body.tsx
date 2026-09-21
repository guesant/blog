import type { useTranslations } from '@/i18n/compat';
import type { ProjectsPageContentProps } from './types';
import { ExperimentsSection } from './experiments-section';
import { ProjectsPageResults } from './projects-page-results';

type ProjectsPageBodyProps = {
  page: ProjectsPageContentProps['page'];
  projects: ProjectsPageContentProps['projects'];
  projectsPagination: ProjectsPageContentProps['projectsPagination'];
  experiments: ProjectsPageContentProps['experiments'];
  experimentsPagination: ProjectsPageContentProps['experimentsPagination'];
  tCommon: ReturnType<typeof useTranslations>;
};

export function ProjectsPageBody(props: ProjectsPageBodyProps) {
  return (
    <>
      <ProjectsPageResults
        page={props.page}
        projects={props.projects}
        pagination={props.projectsPagination}
        tCommon={props.tCommon}
      />
      <ExperimentsSection
        experiments={props.experiments}
        pagination={props.experimentsPagination}
        hasProjects={props.projects.length > 0}
        page={props.page}
        tCommon={props.tCommon}
      />
    </>
  );
}
