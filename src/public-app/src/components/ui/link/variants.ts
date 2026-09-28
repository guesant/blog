import type { SxProps, Theme } from '@mui/material/styles';

export const linkVariants: Record<string, SxProps<Theme>> = {
  sectionHeadingGrid: {
    gridRow: { xs: 3, sm: 1 },
    gridColumn: { xs: 1, sm: 2 },
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.75,
    whiteSpace: 'nowrap',
    fontSize: '.9rem',
    fontWeight: 600,
  },
  creditEntryItem: { fontWeight: 700 },
  statusActions: { py: 1 },
  experimentSource: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.75,
    fontWeight: 600,
  },
  experimentRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 'var(--site-space-3)',
    p: 'var(--site-inset-card)',
    border: 'var(--site-border-width) solid var(--site-border)',
    borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
    backgroundColor: 'var(--site-surface)',
    '&:hover .experiment-title': { color: 'secondary.main' },
  },
  projectDetailContent: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.75,
    fontWeight: 600,
  },
  externalLink: { display: 'inline-flex', alignItems: 'center', gap: 0.75 },
};
