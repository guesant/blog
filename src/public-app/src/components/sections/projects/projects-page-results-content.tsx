import type { CommonTranslator } from '@/i18n/compat-support';
import type { ProjectsPageContentProps } from './types';
import { CollectionListing } from '../../content/collection-listing';
import { EmptyState } from '../../content/empty-state';
import { ProjectsPageSelectedLabel } from './projects-page-selected-label';
import { ProjectRow } from './project-row';

export type ProjectsPageResultsContentProps = {
  page: ProjectsPageContentProps['page'];
  projects: ProjectsPageContentProps['projects'];
  pagination: ProjectsPageContentProps['projectsPagination'];
  tCommon: CommonTranslator;
};

export function ProjectsPageResultsContent(props: ProjectsPageResultsContentProps) {
  return (
    <>
      <ProjectsPageSelectedLabel page={props.page} visible={props.projects.length > 0} />
      <CollectionListing
        items={props.projects}
        getKey={(item) => item.slug}
        renderListItem={(item) => <ProjectRow item={item} />}
        empty={<EmptyState icon="problem">{props.tCommon('emptyProjects')}</EmptyState>}
        pagination={{
          meta: props.pagination,
          action: '/projects',
          pageParameter: 'projects_page',
        }}
      />
    </>
  );
}
