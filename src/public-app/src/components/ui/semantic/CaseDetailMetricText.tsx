import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const CaseDetailMetricText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 },
);
