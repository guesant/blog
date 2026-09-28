import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { MetricsGridFrame } from './MetricsGridFrame';

export const MetricsGridMargin6Frame = createSemanticSxComponent<
  ComponentProps<typeof MetricsGridFrame>
>(MetricsGridFrame, { mt: 6 });
