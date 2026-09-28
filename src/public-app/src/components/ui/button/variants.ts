import type { SxProps, Theme } from '@mui/material/styles';

export const buttonVariants: Record<string, SxProps<Theme>> = {
  topicArrow: { fontSize: 'var(--site-icon-sm)' },
  sourcePreviewOpen: { justifySelf: 'start' },
  topicExplore: { whiteSpace: 'nowrap', textTransform: 'none' },
  fullWidth: { width: '100%' },
};
