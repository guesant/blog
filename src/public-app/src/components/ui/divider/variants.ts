import type { SxProps, Theme } from '@mui/material/styles';

export const dividerVariants: Record<string, SxProps<Theme>> = {
  resumeSection: { mt: 0.5, mb: 2 },
  sidebarGroup: { mt: 0, mb: 'var(--site-sidebar-gap)' },
  explorationSection: { my: 'var(--site-space-8)' },
  aboutSectionDivider: { width: '100%', borderColor: 'var(--site-border)' },
};
