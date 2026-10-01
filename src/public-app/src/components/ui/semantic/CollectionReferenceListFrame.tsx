import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const CollectionReferenceListFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { display: 'flex', flexDirection: 'column', gap: 4, mb: { xs: 9, md: 11 } });
