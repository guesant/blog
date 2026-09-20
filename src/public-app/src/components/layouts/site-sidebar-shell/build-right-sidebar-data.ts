import type { SiteText } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { buildFollowWithFeeds } from './build-follow-with-feeds';
import { buildSidebarBuildUrl } from './build-sidebar-build-url';
import { buildSidebarLegalItems } from './build-sidebar-legal-items';
import { sidebarContactVisible } from './sidebar-contact-visible';
import { sidebarLegalVisible } from './sidebar-legal-visible';
import { sidebarUpdatesVisible } from './sidebar-updates-visible';
import { navigationItem } from './navigation-item';
import { routeSegment } from './route-segment';

type BuildRightSidebarDataProps = {
  site: SiteText;
  locale: string;
  t: Translator;
};

export function buildRightSidebarData(props: BuildRightSidebarDataProps) {
  const visibility = props.site.visibility;

  const showContact = sidebarContactVisible(props.site);

  const followItem =
    props.site.navigation?.footerLinks.find((item) => routeSegment(item.route) === 'follow') ??
    navigationItem('/follow', props.t('follow'));

  const build = buildSidebarBuildUrl(props.site);

  return {
    showContact,
    showLegal: sidebarLegalVisible({ visibility, showContact }),
    showUpdates: sidebarUpdatesVisible(visibility),
    followWithFeeds: buildFollowWithFeeds({ item: followItem, locale: props.locale }),
    legalItems: buildSidebarLegalItems({ visibility, showContact, t: props.t }),
    ...build,
  };
}
