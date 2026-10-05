import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarLayoutWithoutRightSidebarFrameProps = { children: ReactNode };

const baseStyles = {
  minHeight: 'var(--site-viewport-min-height)',
  display: 'grid',
  bgcolor: 'var(--site-surface)',
  overscrollBehaviorY: 'none',
};

export function SidebarLayoutWithoutRightSidebarFrame(
  props: SidebarLayoutWithoutRightSidebarFrameProps,
) {
  return (
    <Box
      sx={{
        ...baseStyles,
        gridTemplateColumns: { xs: '1fr', md: '16rem minmax(0, 1fr)' },
      }}
    >
      {props.children}
    </Box>
  );
}
