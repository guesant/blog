import type {
  InterfaceMessages,
  NavigationAvailability,
  Profile,
  SiteText,
} from '@portfolio/data/domain/types';

export { loadRoute, loadShell } from './content-data-server-functions';

export type { RouteData } from './content-data-route-data';

export type ShellData = {
  profile: Profile;
  site: SiteText;
  availability: NavigationAvailability;
  messages: InterfaceMessages;
};

export type RouteRequest = {
  locale: string;
  pathname: string;
  slug?: string;
  type?: string;
  search?: string;
};
