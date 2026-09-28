import type { SxProps, Theme } from '@mui/material/styles';

const metricsGrid = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(9rem, 1fr))' },
  gap: 3,
  pt: 4,
  borderTop: 1,
  borderColor: 'divider',
};

const feedSection = {
  width: '100%',
  scrollMarginTop: 'var(--site-topbar-h)',
};

const sourcePreviewDetails = {
  display: 'grid',
  alignContent: 'center',
  gap: 'var(--site-space-1)',
  padding: 'var(--site-space-3)',
  minWidth: 0,
  overflow: 'hidden',
  textAlign: 'left',
};

export const boxVariants7: Record<string, SxProps<Theme>> = {
  listingForm: { mb: 'var(--site-space-4)' },
  metricsGrid,
  metricsGridMargin4: { ...metricsGrid, mt: 4 },
  metricsGridMargin6: { ...metricsGrid, mt: 6 },
  feedSection,
  feedSectionDivider: { ...feedSection, borderTop: 1, borderColor: 'divider' },
  sourcePreviewDetailsFeed: sourcePreviewDetails,
};
