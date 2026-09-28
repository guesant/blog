import type { ReactNode } from 'react';
import { Drawer } from '../drawer';

type SidebarMobileDrawerFrameProps = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};

const paperStyles = { width: 'min(var(--site-offcanvas-w), var(--site-offcanvas-max))' };

export function SidebarMobileDrawerFrame(props: SidebarMobileDrawerFrameProps) {
  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={props.onClose}
      PaperProps={{ sx: paperStyles }}
    >
      {props.children}
    </Drawer>
  );
}
