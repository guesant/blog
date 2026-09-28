import type { SxProps, Theme } from '@mui/material/styles';

export const stackVariants: Record<string, SxProps<Theme>> = {
  listingToolbarContent: {
    columnGap: { xs: 'var(--site-space-2)', md: 'var(--site-space-3)' },
    rowGap: 'var(--site-space-5)',
    flexWrap: 'wrap',
  },
  contactDetails: { minWidth: 0, gap: 2 },
  statusActions: { alignItems: 'flex-start' },
  passwordEntropy: { mt: 2 },
  generatedStringList: { mt: 1 },
  contentFeedEmpty: { alignItems: 'center', gap: 'var(--site-space-4)' },
  contentFeedStatus: { alignItems: 'center', mb: 'var(--site-space-4)' },
  contentFeedDisplayControls: {
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--site-space-3)',
    mb: 'var(--site-space-4)',
  },
  progressiveFooter: {
    alignItems: 'center',
    mt: 'var(--site-space-4)',
    minHeight: 'var(--site-space-1)',
  },
  progressiveSkeleton: { gap: 'var(--site-space-4)', width: '100%' },
  contentActionsHero: {
    mt: 0,
    flexWrap: 'wrap',
    gap: 'var(--site-space-2)',
  },
  contentActionsSection: {
    mt: 'var(--site-space-4)',
    flexWrap: 'wrap',
    gap: 'var(--site-space-2)',
  },
  homeAvailability: {
    position: 'relative',
    zIndex: 1,
    mt: 'var(--site-space-3)',
    alignItems: 'center',
    justifyContent: 'center',
    pb: 'var(--site-space-8)',
    borderBottom: 1,
    borderColor: 'divider',
  },
};
