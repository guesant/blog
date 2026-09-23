import { LoadingPage } from '../../sections/loading';
import type { RouteData } from '../../../data/queries';
import { routeRendererFallbacks } from './route-renderer-fallbacks';

type RouteRendererFallbackProps = { kind: RouteData['kind'] };

export function RouteRendererFallback(props: RouteRendererFallbackProps) {
  return routeRendererFallbacks[props.kind] ?? <LoadingPage />;
}
