import type { SxProps, Theme } from '@mui/material/styles';

const contentCard = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-space-2)',
};

const highlightedProjectCard = {
  minHeight: '17rem',
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  transition: 'border-color .2s, background-color .2s, transform .2s',
  '&:hover .project-card-title': { color: 'secondary.main' },
  '&:hover': {
    borderColor: 'rgba(29,95,167,.55)',
    transform: 'translateY(-2px)',
  },
};

const linkedCaseCard = {
  display: 'flex',
  flexDirection: 'column',
  p: 3,
  color: 'text.primary',
  textDecoration: 'none',
  bgcolor: 'rgba(255,255,255,.56)',
  transition: 'border-color .2s, background-color .2s, transform .2s',
  '&:hover': {
    borderColor: 'rgba(29,95,167,.55)',
    bgcolor: 'background.paper',
    transform: 'translateY(-2px)',
  },
  '&:hover .case-link-title': { color: 'secondary.main' },
};

export const cardVariants: Record<string, SxProps<Theme>> = {
  caseCard: {
    ...contentCard,
    p: 'var(--site-inset-card)',
    borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
    bgcolor: 'var(--site-surface)',
    transition:
      'border-color var(--site-duration-short-4), background-color var(--site-duration-short-4)',
    '&:hover': {
      borderColor: 'var(--site-primary-hover)',
      bgcolor: 'var(--site-surface-hover)',
    },
    '&:hover .case-title': { color: 'secondary.main' },
  },
  renderFollowEntryCard: {
    p: 'var(--site-inset-card)',
    color: 'inherit',
    textDecoration: 'none',
    borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
  },
  renderFollowEntryCard2: {
    p: 'var(--site-inset-card)',
    borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
  },
  catalogEntry: {
    ...contentCard,
    p: 'var(--site-inset-card)',
    borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
    color: 'inherit',
    textDecoration: 'none',
  },
  featuredCaseCard: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
    minHeight: { md: '21.5rem' },
    overflow: 'hidden',
    bgcolor: 'background.paper',
  },
  referenceCard: {
    ...contentCard,
    p: 'var(--site-inset-card)',
    bgcolor: 'var(--site-surface)',
    borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
    borderColor: 'var(--site-border)',
    transition:
      'border-color var(--site-duration-short-4), background-color var(--site-duration-short-4)',
    '&:hover .reference-card-title': { color: 'secondary.main' },
    '&:hover': {
      borderColor: 'var(--site-primary-hover)',
      bgcolor: 'var(--site-surface-hover)',
    },
  },
  feedCard: {
    position: 'relative',
    padding:
      'var(--site-space-4) var(--site-space-5) var(--site-space-5) calc(var(--site-space-5) + var(--site-feed-accent-w))',
    display: 'flex',
    flexDirection: 'column',
    borderColor: 'divider',
    border: 'var(--site-border-width) solid var(--site-border)',
    borderRadius: 0,
    gap: 'var(--site-space-2)',
    overflow: 'hidden',
    backgroundColor: 'var(--site-surface)',
    boxShadow: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: '0 auto 0 0',
      width: 'var(--site-feed-accent-w)',
      backgroundColor: 'var(--site-primary)',
    },
    '&:hover .content-feed-title': { color: 'secondary.main' },
  },
  projectCardHighlighted: {
    ...highlightedProjectCard,
    bgcolor: '#EAF2FA',
    borderColor: 'rgba(29,95,167,.28)',
    '&:hover': {
      borderColor: 'rgba(29,95,167,.55)',
      bgcolor: '#E1EDF8',
      transform: 'translateY(-2px)',
    },
  },
  projectCardPlain: {
    ...highlightedProjectCard,
    bgcolor: 'rgba(255,255,255,.72)',
    borderColor: 'divider',
    '&:hover': {
      borderColor: 'rgba(29,95,167,.55)',
      bgcolor: 'background.paper',
      transform: 'translateY(-2px)',
    },
  },
  caseLinkCardCompact: {
    ...linkedCaseCard,
    minHeight: '14rem',
  },
  caseLinkCardFull: {
    ...linkedCaseCard,
    minHeight: 'auto',
  },
};
