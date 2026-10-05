import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Chip as BaseComponent } from '@/components/ui/chip';

export const SourcePreviewKindChip = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  justifySelf: 'start',
  maxWidth: '100%',
  minWidth: 0,
  height: 'auto',
  padding: 0,
  borderRadius: 0,
  backgroundColor: 'transparent',
  color: 'var(--site-text-secondary)',
  fontSize: 'var(--site-text-xs)',
  fontWeight: 'var(--site-weight-semibold)',
  letterSpacing: 'var(--site-letter-label)',
  textTransform: 'uppercase',
  '& .MuiChip-icon': { flexShrink: 0, marginInline: 0 },
  '&.MuiChip-clickable:hover': { backgroundColor: 'transparent' },
  '& .MuiChip-label': {
    minWidth: 0,
    overflow: 'hidden',
    paddingInline: 0,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
