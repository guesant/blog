import { featureFlags } from '../config/feature-flags';
import { detailRouteLoaders } from './content-data-detail-route-loaders';
import { primaryRouteLoaders } from './content-data-primary-route-loaders';
import type { RouteLoader } from './content-data-route-loader';

export const routeLoaders: Record<string, RouteLoader> = {
  ...primaryRouteLoaders,
  ...detailRouteLoaders,
  '/tools': async ({ locale }) =>
    featureFlags.tools
      ? { kind: 'tools-index' }
      : primaryRouteLoaders['/tools']({ locale, pathname: '/tools' }),
  '/tool': async ({ locale, slug }) =>
    featureFlags.tools
      ? { kind: 'tool', slug: slug ?? '' }
      : primaryRouteLoaders['/tool']({ locale, pathname: '/tool' }),
};
