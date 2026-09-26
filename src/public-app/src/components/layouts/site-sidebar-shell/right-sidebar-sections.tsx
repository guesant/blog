import { RightSidebarContactSection } from './right-sidebar-contact-section';
import { RightSidebarSecondarySections } from './right-sidebar-secondary-sections';
import type { RightSidebarSectionsProps } from './right-sidebar-sections-props';

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
