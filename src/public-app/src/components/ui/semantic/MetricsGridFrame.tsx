import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box } from '../box';

export const MetricsGridFrame = createSemanticSxComponent<ComponentProps<typeof Box>>(Box, {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(9rem, 1fr))' },
  gap: 3,
  marginBlockStart: 'var(--site-space-6)',
  pt: 4,
  borderTop: 1,
  borderColor: 'divider',
});
