import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const MaintenanceSignatureText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { mt: 6 });
