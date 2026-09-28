import type { ReactNode } from 'react';
import { Box } from '../box';
import { Typography } from '../typography';

type SidebarContentFooterFrameProps = { children: ReactNode };

const footerStyles = {
  display: 'grid',
  minWidth: 0,
  width: '100%',
  maxWidth: 'var(--site-content-max)',
  boxSizing: 'border-box',
  marginTop: { xs: 'auto', md: 0 },
  marginInline: 'auto',
  paddingInline: 'var(--site-inset-page)',
  paddingBlock: { xs: 'var(--site-space-8)', md: 'var(--site-space-4)' },
  position: 'relative',
  '&::before': {
    position: 'absolute',
    top: 0,
    right: 'var(--site-inset-page)',
    left: 'var(--site-inset-page)',
    borderTop: 'var(--site-border-width) solid var(--site-border-strong)',
    content: '""',
  },
  color: 'var(--site-text-secondary)',
  overflowX: 'clip',
  gap: 'var(--site-space-6)',
};

export function SidebarContentFooterFrame(props: SidebarContentFooterFrameProps) {
  return (
    <Box component="footer" sx={footerStyles}>
      <Typography variant="body2" color="inherit" sx={{ textAlign: 'center' }}>
        {props.children}
      </Typography>
    </Box>
  );
}
