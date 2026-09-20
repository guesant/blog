import type { SxProps, Theme } from '@mui/material/styles';

export const typographyVariants4: Record<string, SxProps<Theme>> = {
  sourcePreviewTitleDetail: {
    margin: 0,
    color: 'var(--site-text-primary)',
    fontSize: 'var(--site-text-xl)',
    fontWeight: 'var(--site-weight-bold)',
    lineHeight: 'var(--site-leading-tight)',
    overflow: 'hidden',
    overflowWrap: 'anywhere',
  },
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
  sourcePreviewDescriptionDetail: {
    margin: 0,
    color: 'var(--site-text-secondary)',
    fontSize: 'var(--site-text-body)',
    lineHeight: 'var(--site-leading-relaxed)',
  },
};
