import type { SxProps, Theme } from '@mui/material/styles';

export const boxVariantsAbout: Record<string, SxProps<Theme>> = {
  aboutPageHeader: { maxWidth: '46rem', mb: 0 },
  aboutEditorialPage: {
    width: '100%',
    maxWidth: 'var(--site-content-max)',
    mx: 'auto',
    display: 'grid',
    rowGap: 'var(--site-space-8)',
  },
  aboutEditorialIntroduction: {
    display: 'grid',
    rowGap: 'var(--site-space-6)',
  },
  aboutEditorialDescription: {
    color: 'text.secondary',
  },
  aboutTimelineSection: {
    display: 'grid',
    rowGap: 'var(--site-space-5)',
  },
  aboutTimelineItem: {
    display: 'grid',
    gridTemplateColumns: { xs: 'minmax(4.5rem, 6rem) minmax(0, 1fr)', sm: '8rem minmax(0, 1fr)' },
    columnGap: 'var(--site-space-4)',
  },
  aboutTimelineRail: {
    position: 'relative',
    display: 'grid',
    rowGap: 'var(--site-space-2)',
    paddingLeft: 'var(--site-space-5)',
    paddingBottom: 'var(--site-space-5)',
    borderLeft: 'var(--site-border-width) solid var(--site-border)',
  },
  aboutTimelinePoint: {
    position: 'absolute',
    top: 0,
    left: 'calc(var(--site-space-5) * -0.5 - var(--site-border-width) * 0.5)',
    width: 'var(--site-space-2)',
    height: 'var(--site-space-2)',
    boxSizing: 'border-box',
    border: 'var(--site-border-width-focus) solid var(--site-primary)',
    borderRadius: '50%',
    backgroundColor: 'var(--site-surface)',
  },
  aboutTimelineEntry: {
    minWidth: 0,
    display: 'grid',
    rowGap: 'var(--site-space-2)',
  },
  aboutEditorialSections: {
    display: 'grid',
    rowGap: 'var(--site-space-8)',
  },
  aboutEditorialSection: {
    display: 'grid',
    rowGap: 'var(--site-space-4)',
  },
  richTextPlain: {
    display: 'grid',
    rowGap: 'var(--site-space-5)',
  },
  richTextContent: {
    '& p, & li': {
      textAlign: 'justify',
      hyphens: 'auto',
    },
  },
};
