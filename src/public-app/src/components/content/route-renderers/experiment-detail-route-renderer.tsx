import { ExperimentDetailContent } from '../../sections/experiment-detail';
import { createRouteRenderer } from './create-route-renderer';

export const ExperimentDetailRouteRenderer = createRouteRenderer({
  kind: 'experiment-detail',
  render: (data) => <ExperimentDetailContent experiment={data.experiment} />,
});
