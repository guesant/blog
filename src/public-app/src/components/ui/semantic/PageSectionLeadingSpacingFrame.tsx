import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const PageSectionLeadingSpacingFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { mt: { xs: 6, md: 8 } });
