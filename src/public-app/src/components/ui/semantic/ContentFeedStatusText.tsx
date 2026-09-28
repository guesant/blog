import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const ContentFeedStatusText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { textAlign: 'center' });
