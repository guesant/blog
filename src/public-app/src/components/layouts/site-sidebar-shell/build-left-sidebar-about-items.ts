import type { NavigationItem } from '@portfolio/data/domain/types';
import type { NavTranslator } from '@/i18n/compat-support';
import { aboutRoutes } from './types';
import { routeSegment } from './route-segment';

type BuildLeftSidebarAboutItemsProps = {
  aboutGroup: NavigationItem[];
  visibleRoutes: string[];
  tNav: NavTranslator;
};

export function buildLeftSidebarAboutItems(
  props: BuildLeftSidebarAboutItemsProps,
): NavigationItem[] {
  return aboutRoutes
    .map(
      (route) =>
        props.aboutGroup.find((item) => routeSegment(item.route) === route) ?? {
          route: `/${route}`,
          label: props.tNav(route),
          children: [],
        },
    )
    .filter((item) => props.visibleRoutes.includes(routeSegment(item.route)));
}
