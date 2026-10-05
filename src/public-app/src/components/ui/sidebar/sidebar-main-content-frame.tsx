import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarMainContentFrameProps = { children: ReactNode };

const styles = {
  flex: 1,
  minWidth: 0,
  overflowX: 'clip',
  overflowY: 'auto',
  paddingInline: { xs: 'var(--site-space-3)', md: 'var(--site-space-4)' },
  scrollbarGutter: 'stable',
  backgroundColor: 'var(--grid-background)',
  backgroundImage:
    'linear-gradient(var(--grid-color) var(--grid-line-width), transparent var(--grid-line-width)), linear-gradient(90deg, var(--grid-color) var(--grid-line-width), transparent var(--grid-line-width))',
  backgroundSize: 'var(--grid-size) var(--grid-size)',
  backgroundPosition: '0 calc(var(--site-space-2) * 9)',
  '@media (min-width: 48rem)': {
    backgroundPosition: 'calc(50% - var(--site-content-half)) calc(var(--site-space-2) * 9)',
  },
};

export function SidebarMainContentFrame(props: SidebarMainContentFrameProps) {
  return (
    <Box component="main" data-navigation-scroll-container sx={styles}>
      {props.children}
    </Box>
  );
}
