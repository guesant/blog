import type { SxProps, Theme } from '@mui/material/styles';

export const typographyVariants4: Record<string, SxProps<Theme>> = {
  sourcePreviewTitleFeed: {
    margin: 0,
    width: '100%',
    color: 'var(--site-text-primary)',
    fontSize: 'var(--site-text-sm)',
    fontWeight: 'var(--site-weight-bold)',
    lineHeight: 'var(--site-leading-tight)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sourcePreviewDescriptionFeed: {
    margin: 0,
    width: '100%',
    color: 'var(--site-text-secondary)',
    fontSize: 'var(--site-text-xs)',
    lineHeight: 'var(--site-leading-normal)',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textAlign: 'left',
  },
};
