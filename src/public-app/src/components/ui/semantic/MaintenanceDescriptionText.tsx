import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const MaintenanceDescriptionText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { mt: 2.5, maxWidth: '34rem' });
