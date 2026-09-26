import type { SiteText } from '@portfolio/data/domain/types';
import type { NavTranslator, SidebarTranslationKey } from '@/i18n/compat-support';
import { buildLeftSidebarAboutItems } from './build-left-sidebar-about-items';
import { isAboutRoute } from './is-about-route';
import { localizeNavigationItem } from './localize-navigation-item';
import { navigationItem } from './navigation-item';
import { visibleAboutRoutes } from './visible-about-routes';

type BuildLeftSidebarDataProps = {
  site: SiteText;
  currentPathname: string;
  tNav: NavTranslator;
};

export function buildLeftSidebarData(props: BuildLeftSidebarDataProps) {
  const groups = (props.site.navigation?.sidebar ?? []).map((items) =>
    items.map((item) => localizeNavigationItem({ item, t: props.tNav })),
  );

  const aboutGroup = groups.flatMap((group) => group).filter((item) => isAboutRoute(item.route));

  const contentGroups = groups
    .map((items) => items.filter((item) => !isAboutRoute(item.route)))
    .filter((items) => items.length > 0);

  const visibleRoutes = visibleAboutRoutes(props.site.visibility);

  const aboutItems = buildLeftSidebarAboutItems({
    aboutGroup,
    visibleRoutes,
    tNav: props.tNav,
  });

  return {
    contentGroups,
    aboutVisible: props.site.visibility?.about ?? true,
    aboutItem: {
      route: '/about',
      label: props.tNav('about'),
      children: aboutItems,
    },
    homeItem: navigationItem('/', props.tNav('home')),
    currentPathname: props.currentPathname,
    routeSegments: props.currentPathname.split('/').filter(Boolean),
    contentGroupLabel: (): SidebarTranslationKey => 'groupContent',
  };
}
