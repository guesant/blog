import { SidebarRightColumnFrame, SidebarRightStackFrame } from '../../ui';
import { RightSidebarSections } from './right-sidebar-sections';
import type { SiteText } from '@portfolio/data/domain/types';
import type { buildRightSidebarData } from './build-right-sidebar-data';
import type { SidebarTranslator } from '@/i18n/compat-support';

type RightSidebarViewProps = {
  site: SiteText;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
  t: SidebarTranslator;
  data: ReturnType<typeof buildRightSidebarData>;
  mobile?: boolean;
};

export function RightSidebarView(props: RightSidebarViewProps) {
  return (
    <SidebarRightColumnFrame mobile={Boolean(props.mobile)}>
      <SidebarRightStackFrame>
        <RightSidebarSections {...props} />
      </SidebarRightStackFrame>
    </SidebarRightColumnFrame>
  );
}
