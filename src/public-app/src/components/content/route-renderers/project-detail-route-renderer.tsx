import { ProjectDetailContent } from '../../sections/project-detail';
import type { RouteRendererProps } from './route-renderers.types';

type ProjectDetailRouteRendererProps = RouteRendererProps;

export function ProjectDetailRouteRenderer(props: ProjectDetailRouteRendererProps) {
  if (props.data.kind !== 'project-detail') {
    return null;
  }

  return <ProjectDetailContent project={props.data.project} />;
}
