import type { SxProps, Theme } from '@mui/material/styles';

const sidebarGroup = { gap: 'var(--site-sidebar-gap)', mt: 'var(--site-sidebar-gap)' };

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
  mobileSidebarStack: {
    overflowY: 'auto',
    gap: 'var(--site-sidebar-gap)',
    p: 'var(--site-space-3)',
  },
  sidebarGroup,
  sidebarSection: sidebarGroup,
  rightSidebar: { gap: 'var(--site-sidebar-gap)' },
  contentFeedEmpty: { alignItems: 'center', gap: 'var(--site-space-4)' },
  contentFeedStatus: { alignItems: 'center', mb: 'var(--site-space-4)' },
  contentFeedDisplayControls: {
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--site-space-3)',
    mb: 'var(--site-space-4)',
  },
  feedCard: {
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--site-space-3)',
    color: 'var(--site-text-secondary)',
    fontSize: 'var(--site-text-xs)',
    fontWeight: 'var(--site-weight-medium)',
    letterSpacing: 'var(--site-letter-label)',
    textTransform: 'uppercase',
  },
  listingList: { gap: 'var(--site-space-4)' },
  progressiveFooter: {
    alignItems: 'center',
    mt: 'var(--site-space-4)',
    minHeight: 'var(--site-space-1)',
  },
  progressiveSkeleton: { gap: 'var(--site-space-4)', width: '100%' },
  listingView: {
    gap: 'var(--site-space-4)',
    mb: { xs: 'var(--site-space-10)', md: 'var(--site-space-12)' },
  },
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
  sidebarSubnav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--site-sidebar-gap)',
    mt: 'var(--site-sidebar-gap)',
    ml: 'var(--site-space-3)',
    pl: 'var(--site-space-3)',
    borderLeft: 'var(--site-border-width) solid',
    borderColor: 'divider',
  },
  sidebarNavStack: { gap: 'var(--site-sidebar-gap)', flex: 1, minHeight: 0 },
  sidebarNavStackCompact: { gap: 'var(--site-sidebar-gap)' },
};
