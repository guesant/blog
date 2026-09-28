import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { MetricsGridFrame } from './MetricsGridFrame';

export const MetricsGridMargin4Frame = createSemanticSxComponent<
  ComponentProps<typeof MetricsGridFrame>
>(MetricsGridFrame, { mt: 4 });
