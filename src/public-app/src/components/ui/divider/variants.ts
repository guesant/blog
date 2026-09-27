import type { SxProps, Theme } from '@mui/material/styles';

export const dividerVariants: Record<string, SxProps<Theme>> = {
  sectionShell: { width: '100%', borderColor: 'var(--site-border)' },
  resumeSection: { mt: 0.5, mb: 2 },
  sidebarGroup: { mt: 0, mb: 'var(--site-sidebar-gap)' },
  aboutSectionDivider: { width: '100%', borderColor: 'var(--site-border)' },
};
