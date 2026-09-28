import type { SxProps, Theme } from '@mui/material/styles';

export const chipVariants: Record<string, SxProps<Theme>> = {
  referenceLinkContent: {
    flex: 'none',
    backgroundColor: 'var(--site-accent-bg)',
    color: 'var(--site-primary)',
    fontSize: 'var(--site-text-xs)',
    fontWeight: 'var(--site-weight-semibold)',
    letterSpacing: 'var(--site-letter-label)',
    textTransform: 'uppercase',
  },
  sourcePreviewKind: {
    justifySelf: 'start',
    maxWidth: '100%',
    minWidth: 0,
    height: 'var(--site-control-h-xs)',
    padding: 'var(--site-space-0-5) var(--site-space-1)',
    borderRadius: 0,
    backgroundColor: 'var(--site-accent-bg)',
    color: 'var(--site-primary)',
    fontSize: 'var(--site-text-xs)',
    fontWeight: 'var(--site-weight-semibold)',
    letterSpacing: 'var(--site-letter-label)',
    textTransform: 'uppercase',
    '& .MuiChip-icon': {
      flexShrink: 0,
      marginInline: 'var(--site-space-1)',
    },
    '& .MuiChip-label': {
      minWidth: 0,
      overflow: 'hidden',
      paddingInline: 'var(--site-space-1)',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
};
