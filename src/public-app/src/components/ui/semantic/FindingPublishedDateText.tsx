import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const FindingPublishedDateText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { color: 'var(--site-text-secondary)', fontSize: 'var(--site-text-sm)' });
