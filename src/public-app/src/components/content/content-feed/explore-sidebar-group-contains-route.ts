import type { SidebarGroup, SiteText } from '@portfolio/data/domain/types';
import { visibleRoute } from '../../navigation/visible-route';

export function exploreSidebarGroupContainsRoute(
  group: SidebarGroup,
  route: string,
  visibility?: SiteText['visibility'],
): boolean {
  return group.items.some(
    (item) =>
      visibleRoute(item.route, { visibility }) &&
      (item.route === route ||
        item.children.some(
          (child) => visibleRoute(child.route, { visibility }) && child.route === route,
        )),
  );
}
