import { ProjectsPageContent } from '../../sections/projects';
import type { RouteRendererProps } from './route-renderers.types';

type ProjectsRouteRendererProps = RouteRendererProps;

export function ProjectsRouteRenderer(props: ProjectsRouteRendererProps) {
  if (props.data.kind !== 'projects') {
    return null;
  }

  return (
    <ProjectsPageContent
      page={props.data.page}
      projects={props.data.projects}
      experiments={props.data.experiments}
      projectsPagination={props.data.projectsPagination}
      experimentsPagination={props.data.experimentsPagination}
    />
  );
}
