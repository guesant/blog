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
};

export const boxVariants7: Record<string, SxProps<Theme>> = {
  revealPanel: {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 'var(--site-space-2)',
    alignItems: 'start',
  },
  revealDialogLiveRegion: { display: 'flex', justifyContent: 'center' },
  listingForm: { mb: 'var(--site-space-4)' },
  siteSidebarShell: {
    minHeight: '100dvh',
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: '16rem minmax(0, 1fr) 16rem',
    },
    bgcolor: 'var(--site-surface)',
  },
  siteSidebarShellWithoutRight: {
    minHeight: '100dvh',
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: '16rem minmax(0, 1fr)',
    },
    bgcolor: 'var(--site-surface)',
  },
  sidebarNav: {
    p: 2,
    minWidth: 0,
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarNavCompact: { p: 2, minWidth: 0 },
  creditsSection: { mt: { xs: 4, md: 5 }, maxWidth: '60ch' },
  creditsSectionFull: { mt: { xs: 4, md: 5 }, maxWidth: 'none' },
  metricsGrid,
  metricsGridMargin4: { ...metricsGrid, mt: 4 },
  metricsGridMargin6: { ...metricsGrid, mt: 6 },
  explorationSection: { textAlign: 'center' },
  explorationSectionSpaced: { mt: 'var(--site-space-8)', textAlign: 'center' },
  feedSection,
  feedSectionDivider: { ...feedSection, borderTop: 1, borderColor: 'divider' },
  sourcePreviewDetailsFeed: sourcePreviewDetails,
  sourcePreviewDetailsDetail: {
    display: 'grid',
    alignContent: 'start',
    gap: 'var(--site-space-4)',
    padding: 'var(--site-space-5)',
    minWidth: 0,
    overflow: 'hidden',
  },
  sourcePreviewDetailsTable: { ...sourcePreviewDetails, padding: 'var(--site-space-2)' },
};
