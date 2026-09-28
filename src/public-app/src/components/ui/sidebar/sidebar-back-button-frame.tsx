import type { ElementType, ReactNode } from 'react';
import { IconButton } from '../icon-button';

type SidebarBackButtonFrameProps = {
  children: ReactNode;
  component?: ElementType;
  href?: string;
  label: string;
};

const styles = {
  display: { xs: 'inline-flex', md: 'none' },
  position: 'absolute',
  insetInlineStart: 0,
};

export function SidebarBackButtonFrame(props: SidebarBackButtonFrameProps) {
  return (
    <IconButton
      component={props.component}
      href={props.href}
      aria-label={props.label}
      size="small"
      sx={styles}
    >
      {props.children}
    </IconButton>
  );
}
