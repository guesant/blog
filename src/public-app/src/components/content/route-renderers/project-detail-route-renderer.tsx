import { ProjectDetailContent } from '../../sections/project-detail';
import { createRouteRenderer } from './create-route-renderer';

export const ProjectDetailRouteRenderer = createRouteRenderer({
  kind: 'project-detail',
  render: (data) => <ProjectDetailContent project={data.project} />,
});
