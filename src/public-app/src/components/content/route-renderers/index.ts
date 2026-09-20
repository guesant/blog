import { detailRouteRenderers } from './details';
import { primaryRouteRenderers } from './primary';
import { secondaryRouteRenderers } from './secondary';
import type { RouteRenderer } from './route-renderers.types';

export const routeRenderers: Record<string, RouteRenderer> = {
  ...primaryRouteRenderers,
  ...detailRouteRenderers,
  ...secondaryRouteRenderers,
};
