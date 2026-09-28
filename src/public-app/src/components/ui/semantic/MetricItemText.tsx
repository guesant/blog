import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const MetricItemText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { fontWeight: 700 },
);
