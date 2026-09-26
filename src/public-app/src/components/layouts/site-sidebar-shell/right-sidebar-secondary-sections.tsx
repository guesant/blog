import { RightSidebarLegalSection } from './right-sidebar-legal-section';
import { RightSidebarSourceSection } from './right-sidebar-source-section';
import { RightSidebarUpdatesSection } from './right-sidebar-updates-section';
import type { RightSidebarSectionsProps } from './right-sidebar-sections-props';

type RightSidebarSecondarySectionsProps = RightSidebarSectionsProps;

export function RightSidebarSecondarySections(props: RightSidebarSecondarySectionsProps) {
  return (
    <>
      <RightSidebarLegalSection
        visible={props.data.showLegal}
        items={props.data.legalItems}
        label={props.t('legal')}
        pathname={props.pathname}
        locale={props.locale}
        onNavigate={props.onNavigate}
      />
      <RightSidebarUpdatesSection
        visible={props.data.showUpdates}
        item={props.data.followWithFeeds}
        label={props.t('updates')}
        pathname={props.pathname}
        locale={props.locale}
        site={props.site}
        onNavigate={props.onNavigate}
      />
      <RightSidebarSourceSection
        visible={Boolean(props.data.buildUrl)}
        buildUrl={props.data.buildUrl}
        buildSha={props.data.buildSha}
        label={props.t('source')}
      />
    </>
  );
}
