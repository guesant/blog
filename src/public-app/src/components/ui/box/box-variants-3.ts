import type { SxProps, Theme } from '@mui/material/styles';
import { richTextBody } from './rich-text-body';

export const boxVariants3: Record<string, SxProps<Theme>> = {
  referenceLinkItem: {
    '& + &': {
      borderTop: 'var(--site-border-width) solid var(--site-border-subtle)',
    },
  },
  referenceLinkLabel: {
    display: 'grid',
    flex: '1 1 auto',
    minWidth: 0,
    gap: 'var(--site-space-0-5)',
  },
  factEntry: {
    display: 'grid',
    alignContent: 'start',
    gap: 'var(--site-space-1)',
    minWidth: 0,
    padding: 'var(--site-space-3)',
    border: 'var(--site-border-width) solid var(--site-border)',
    borderRadius: 0,
    backgroundColor: 'var(--site-surface)',
  },
  referenceLinkContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--site-space-3)',
    minWidth: 0,
    padding: 'var(--site-space-3) var(--site-space-4)',
    color: 'var(--site-text-primary)',
    textDecoration: 'none',
    '&:hover': { backgroundColor: 'var(--site-surface-hover)' },
  },
  factGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
    gap: 'var(--site-space-3)',
    margin: 0,
  },
  linkList: {
    display: 'grid',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    listStyle: 'none',
    border: 'var(--site-border-width) solid var(--site-border)',
    borderRadius: 0,
    backgroundColor: 'var(--site-surface)',
  },
  linkSectionContent: { display: 'grid', gap: 'var(--site-space-4)' },
  findingSection: {
    display: 'grid',
    gap: 'var(--site-space-4)',
    paddingBlock: 0,
    paddingInline: 0,
    borderRadius: 0,
    backgroundColor: 'var(--site-surface)',
  },
  achadoDetailContent: { display: 'grid', gap: 'var(--site-space-6)' },
  achadoDetailContent2: { display: 'grid', gap: 'var(--site-space-3)' },
  experimentSource: { mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' },
  experimentBody: richTextBody,
};
