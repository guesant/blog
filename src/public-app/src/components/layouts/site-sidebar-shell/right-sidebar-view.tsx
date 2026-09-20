import { Box, Stack } from '../../ui';
import { RightSidebarSections } from './right-sidebar-sections';
import type { SiteText } from '@portfolio/data/domain/types';
import type { buildRightSidebarData } from './build-right-sidebar-data';
import type { Translator } from '@/i18n/compat-support';

type RightSidebarViewProps = {
  site: SiteText;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
  t: Translator;
  data: ReturnType<typeof buildRightSidebarData>;
};

export function RightSidebarView(props: RightSidebarViewProps) {
  return (
    <Box component="aside" visualVariant="rightSidebar">
      <Stack visualVariant="rightSidebar">
        <RightSidebarSections {...props} />
      </Stack>
    </Box>
  );
}
