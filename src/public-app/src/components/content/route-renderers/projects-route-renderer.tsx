import { ProjectsPageContent } from '../../sections/projects';
import { createRouteRenderer } from './create-route-renderer';

export const ProjectsRouteRenderer = createRouteRenderer({
  kind: 'projects',
  render: (data) => (
    <ProjectsPageContent
      page={data.page}
      projects={data.projects}
      experiments={data.experiments}
      projectsPagination={data.projectsPagination}
      experimentsPagination={data.experimentsPagination}
    />
  ),
});
