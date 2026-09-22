import { LoadingPage } from '../../sections/loading';
import type { RouteRendererProps } from './route-renderers.types';

type LoadingRouteRendererProps = RouteRendererProps;

export default function LoadingRouteRenderer(props: LoadingRouteRendererProps) {
  if (props.data.kind !== 'loading') {
    return null;
  }

  return <LoadingPage />;
}
