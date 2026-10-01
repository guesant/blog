import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Container as BaseComponent } from '@/components/ui/container';

export const MaintenancePageContainer = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { px: { xs: 3, sm: 5 } });
