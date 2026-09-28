import type { SxProps, Theme } from '@mui/material/styles';

export type PageHeaderLayout = 'standard' | 'detail' | 'contentFeed' | 'about' | 'findingDetail';

const pageIntroLayout: SxProps<Theme> = {
  display: 'grid',
  rowGap: 'var(--site-page-content-offset)',
  marginBlockStart: 0,
};

export const pageHeaderLayoutStyles: Record<PageHeaderLayout, SxProps<Theme>> = {
  standard: { ...pageIntroLayout, maxWidth: 'var(--site-page-header-max)' },
  detail: {
    display: 'grid',
    rowGap: 'var(--site-page-content-offset)',
    maxWidth: 'var(--site-lede-max)',
  },
  contentFeed: {
    ...pageIntroLayout,
    maxWidth: 'var(--site-content-max)',
    textAlign: 'center',
  },
  about: { ...pageIntroLayout, maxWidth: 'var(--site-page-header-max)' },
  findingDetail: {
    display: 'grid',
    rowGap: 'var(--site-page-content-offset)',
  },
};

const standardTitle: SxProps<Theme> = {
  margin: 0,
  fontSize: 'var(--site-text-3xl)',
};

const standardDescription: SxProps<Theme> = {
  margin: 0,
  maxWidth: 'var(--site-page-header-description-max)',
  fontSize: 'var(--site-text-lg)',
  textAlign: 'justify',
  hyphens: 'auto',
};

const detailDescription: SxProps<Theme> = {
  margin: 0,
  maxWidth: 'var(--site-detail-header-description-max)',
  fontSize: 'var(--site-text-lg)',
  lineHeight: 'var(--site-leading-relaxed)',
};

export const pageHeaderSlotStyles: Record<
  PageHeaderLayout,
  { title: SxProps<Theme>; description: SxProps<Theme>; meta: SxProps<Theme> }
> = {
  standard: { title: standardTitle, description: standardDescription, meta: { margin: 0 } },
  detail: {
    title: standardTitle,
    description: detailDescription,
    meta: { margin: 0, fontSize: 'var(--site-text-sm)' },
  },
  contentFeed: {
    title: standardTitle,
    description: {
      ...standardDescription,
      maxWidth: 'var(--site-lede-max)',
      marginInline: 'auto',
      textAlign: 'center',
    },
    meta: { margin: 0 },
  },
  about: { title: standardTitle, description: standardDescription, meta: { margin: 0 } },
  findingDetail: {
    title: {
      ...standardTitle,
      color: 'var(--site-text-primary)',
      fontWeight: 'var(--site-weight-bold)',
      letterSpacing: 'var(--site-letter-heading)',
      lineHeight: 'var(--site-leading-tight)',
    },
    description: {
      ...detailDescription,
      color: 'var(--site-text-primary)',
      fontSize: 'var(--site-text-lg)',
    },
    meta: { margin: 0 },
  },
};
