import type { SxProps, Theme } from '@mui/material/styles';

export const iconButtonVariants: Record<string, SxProps<Theme>> = {
  sidebarBackButton: { display: { xs: 'inline-flex', md: 'none' } },
  revealDialogCloseButton: { position: 'absolute', top: 8, right: 8 },
  contentFeedSearchClear: { padding: 'var(--site-space-1)' },
  feedSelectClear: { padding: 'var(--site-space-1)' },
};
