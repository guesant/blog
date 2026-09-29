import type { SxProps, Theme } from '@mui/material/styles';

export type PageHeaderVariant = 'showcase' | 'reading';

const pageIntroLayout: SxProps<Theme> = {
  display: 'grid',
  rowGap: 'var(--site-page-content-offset)',
  marginBlockStart: 0,
};

export const pageHeaderVariantStyles: Record<PageHeaderVariant, SxProps<Theme>> = {
  showcase: {
    ...pageIntroLayout,
    maxWidth: 'var(--site-content-max)',
    textAlign: 'center',
  },
  reading: { ...pageIntroLayout, maxWidth: 'var(--site-page-header-max)', textAlign: 'left' },
};

const pageTitle: SxProps<Theme> = {
  margin: 0,
  fontSize: 'var(--site-text-3xl)',
};

const readingDescription: SxProps<Theme> = {
  margin: 0,
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  fontSize: 'var(--site-text-lg)',
  textAlign: 'justify',
  hyphens: 'auto',
};

export const pageHeaderSlotStyles: Record<
  PageHeaderVariant,
  { title: SxProps<Theme>; description: SxProps<Theme>; meta: SxProps<Theme> }
> = {
  showcase: {
    title: pageTitle,
    description: {
      ...readingDescription,
      marginInline: 'auto',
      textAlign: 'center',
    },
    meta: { margin: 0 },
  },
  reading: {
    title: pageTitle,
    description: readingDescription,
    meta: { margin: 0 },
  },
};
