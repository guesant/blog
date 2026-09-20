import type { SxProps, Theme } from '@mui/material/styles';

export const buttonVariants: Record<string, SxProps<Theme>> = {
  resumePdfOptionsButton: { px: 1 },
  topicArrow: { fontSize: 'var(--site-icon-sm)' },
  feedCard: { fontSize: 14 },
  sidebarActionActive: {
    backgroundColor: 'var(--site-accent-bg)',
    '&:hover': {
      color: 'var(--site-primary)',
      backgroundColor: 'var(--site-accent-bg)',
    },
  },
  sidebarAction: {
    backgroundColor: 'transparent',
    '&:hover': {
      color: 'var(--site-primary)',
      backgroundColor: 'var(--site-surface-hover)',
    },
  },
  feedCardReadMore: {
    flexShrink: 0,
    minHeight: 'var(--site-control-h-sm)',
    marginLeft: 'auto',
    px: 'var(--site-space-2)',
    gap: 'var(--site-space-1)',
    color: 'var(--site-primary)',
    fontSize: 'var(--site-text-sm)',
    fontWeight: 'var(--site-weight-semibold)',
    textDecoration: 'none',
    textTransform: 'none',
    '&:hover': { backgroundColor: 'transparent', textDecoration: 'none' },
  },
  paginationFirst: { marginLeft: 0 },
  sourcePreviewOpen: { justifySelf: 'start' },
  topicExplore: { whiteSpace: 'nowrap', textTransform: 'none' },
  fullWidth: { width: '100%' },
};
