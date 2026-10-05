import type { SidebarGroup } from '@portfolio/data/domain/types';

export function exploreSidebarGroupContainsRoute(group: SidebarGroup, route: string): boolean {
  return group.items.some(
    (item) => item.route === route || item.children.some((child) => child.route === route),
  );
}
