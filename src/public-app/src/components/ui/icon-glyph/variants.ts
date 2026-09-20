import type { CSSProperties } from 'react';

export const iconGlyphVariants: Record<string, CSSProperties> = {
  base: { display: 'block', flex: '0 0 auto' },
  muted: { display: 'block', flex: '0 0 auto', opacity: 0.6 },
  status: { display: 'block', flex: '0 0 auto', opacity: 0.45, marginBottom: '0.75rem' },
  emptyState: { display: 'block', flex: '0 0 auto', marginBottom: '0.75rem', opacity: 0.45 },
  caseIllustration: { display: 'block', flex: '0 0 auto', position: 'relative', zIndex: 1 },
  caseIllustrationIcon: {
    display: 'block',
    position: 'relative',
    zIndex: 1,
  },
  emptyStateIcon: { marginBottom: '0.75rem', opacity: 0.45 },
  externalLinkLeadingIcon: { opacity: 0.6 },
  statusIcon: { opacity: 0.45, marginBottom: '0.75rem' },
};
