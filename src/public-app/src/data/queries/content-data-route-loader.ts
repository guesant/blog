import type { RouteData, RouteRequest } from './content-data-support';
import type { Profile, SiteText } from '../domain/types';

export type RouteLoadContext = {
  shell?: {
    profile: Profile;
    site: SiteText;
  };
};

export type RouteLoader = (data: RouteRequest, context?: RouteLoadContext) => Promise<RouteData>;
