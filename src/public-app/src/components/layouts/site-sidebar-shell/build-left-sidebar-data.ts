import type { SiteText } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { buildLeftSidebarAboutItems } from './build-left-sidebar-about-items';
import { isAboutRoute } from './is-about-route';
import { navigationItem } from './navigation-item';
import { visibleAboutRoutes } from './visible-about-routes';

type BuildLeftSidebarDataProps = {
  site: SiteText;
  currentPathname: string;
  tNav: Translator;
};

export function buildLeftSidebarData(props: BuildLeftSidebarDataProps) {
  const groups = props.site.navigation?.sidebar ?? [];

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
    contentGroupLabel: () => 'groupContent',
  };
}
