import type { SidebarTranslator } from '@/i18n/compat-support';
import type { SiteText } from '@portfolio/data/domain/types';
import type { buildRightSidebarData } from './build-right-sidebar-data';

export type RightSidebarSectionsProps = {
  data: ReturnType<typeof buildRightSidebarData>;
  locale: string;
  onNavigate?: () => void;
  pathname: string;
  site: SiteText;
  t: SidebarTranslator;
};
