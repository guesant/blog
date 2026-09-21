import { StatusPage } from '../../sections/status';
import type { RouteRendererProps } from './route-renderers.types';

type StatusRouteRendererProps = RouteRendererProps;

export function StatusRouteRenderer(props: StatusRouteRendererProps) {
  if (props.data.kind !== 'status') {
    return null;
  }

  return (
    <StatusPage kind={props.data.status} sourceRepositoryUrl={props.data.sourceRepositoryUrl} />
  );
}
