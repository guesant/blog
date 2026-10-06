import type { SiteNavigation } from '../site-navigation-context';
import { exploreSidebarGroupContainsRoute } from './explore-sidebar-group-contains-route';

export function exploreTileIsInSidebar(navigation: SiteNavigation, route: string): boolean {
  return navigation.sidebar.some((group) =>
    exploreSidebarGroupContainsRoute(group, route, navigation.visibility),
  );
}
