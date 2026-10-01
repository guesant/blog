import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const CaseDetailTechnologyListText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  mt: 6,
  pt: 3,
  borderTop: 1,
  borderColor: 'divider',
  color: 'text.secondary',
  fontSize: '.875rem',
});
