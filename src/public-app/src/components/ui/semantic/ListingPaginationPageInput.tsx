import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { TextField as BaseComponent } from '@/components/ui/text-field';

export const ListingPaginationPageInput = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  width: 'var(--site-control-w-page)',
  '& input': {
    textAlign: 'center',
  },
});
