import type { SxProps, Theme } from '@mui/material/styles';
import { editorialDescriptionStyles, editorialPageTitleStyles } from '../editorial-typography';

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
    textAlign: 'left',
  },
  reading: { ...pageIntroLayout, maxWidth: 'var(--site-page-header-max)', textAlign: 'left' },
};

export const pageHeaderSlotStyles: Record<
  PageHeaderVariant,
  { title: SxProps<Theme>; description: SxProps<Theme>; meta: SxProps<Theme> }
> = {
  showcase: {
    title: editorialPageTitleStyles,
    description: editorialDescriptionStyles,
    meta: { margin: 0 },
  },
  reading: {
    title: editorialPageTitleStyles,
    description: editorialDescriptionStyles,
    meta: { margin: 0 },
  },
};
