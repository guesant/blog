import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const MaintenanceTitleText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { mt: 2, fontSize: { xs: '2.5rem', sm: '3rem' } },
);
