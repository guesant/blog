import type { SxProps, Theme } from '@mui/material/styles';

export const typographyVariants4: Record<string, SxProps<Theme>> = {
  sourcePreviewDescriptionFeed: {
    margin: 0,
    color: 'var(--site-text-secondary)',
    fontSize: 'var(--site-text-xs)',
    lineHeight: 'var(--site-leading-normal)',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
};
