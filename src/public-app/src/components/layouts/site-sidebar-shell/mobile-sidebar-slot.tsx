import { createElement, lazy, Suspense } from 'react';
import type { SidebarLayoutProps } from './sidebar-layout.types';

type MobileSidebarSlotProps = SidebarLayoutProps & {
  open: boolean;
  showRight: boolean;
  onClose: () => void;
};

const MobileSidebarDrawer = lazy(() =>
  import('./mobile-sidebar-drawer').then((module) => ({
    default: module.MobileSidebarDrawer,
  })),
);

export function MobileSidebarSlot(props: MobileSidebarSlotProps) {
  if (!props.open) {
    return null;
  }

  return <Suspense fallback={null}>{createElement(MobileSidebarDrawer, props)}</Suspense>;
}
