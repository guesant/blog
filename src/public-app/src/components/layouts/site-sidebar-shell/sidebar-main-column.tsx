import type { ReactNode } from 'react';
import { Box } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { MobileSidebarTopbar } from './mobile-sidebar-topbar';
import { SidebarMainContent } from './sidebar-main-content';

type SidebarMainColumnProps = {
  children: ReactNode;
  copyright: string;
  onOpen: () => void;
};

export function SidebarMainColumn(props: SidebarMainColumnProps) {
  const t = useTranslations('Sidebar');

  return (
    <Box visualVariant="sidebarMainColumn">
      <MobileSidebarTopbar onOpen={props.onOpen} t={t} />
      <SidebarMainContent copyright={props.copyright}>{props.children}</SidebarMainContent>
    </Box>
  );
}
