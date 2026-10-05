import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const MaintenancePageSurfaceFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  minHeight: 'var(--site-viewport-min-height)',
  display: 'grid',
  alignItems: 'center',
  bgcolor: 'background.default',
  color: 'text.primary',
  py: 8,
});
