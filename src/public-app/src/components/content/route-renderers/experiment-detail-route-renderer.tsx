import { ExperimentDetailContent } from '../../sections/experiment-detail';
import type { RouteRendererProps } from './route-renderers.types';

type ExperimentDetailRouteRendererProps = RouteRendererProps;

export function ExperimentDetailRouteRenderer(props: ExperimentDetailRouteRendererProps) {
  if (props.data.kind !== 'experiment-detail') {
    return null;
  }

  return <ExperimentDetailContent experiment={props.data.experiment} />;
}
