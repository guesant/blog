import { RightSidebarContactSection } from './right-sidebar-contact-section';
import { RightSidebarSecondarySections } from './right-sidebar-secondary-sections';
import type { SiteText } from '@portfolio/data/domain/types';
import type { buildRightSidebarData } from './build-right-sidebar-data';
import type { SidebarTranslator } from '@/i18n/compat-support';

type RightSidebarSectionsProps = {
  site: SiteText;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
  t: SidebarTranslator;
  data: ReturnType<typeof buildRightSidebarData>;
};

export function RightSidebarSections(props: RightSidebarSectionsProps) {
  return (
    <>
      <RightSidebarContactSection
        showContact={props.data.showContact}
        site={props.site}
        pathname={props.pathname}
        locale={props.locale}
        onNavigate={props.onNavigate}
        t={props.t}
      />
      <RightSidebarSecondarySections {...props} />
    </>
  );
}
