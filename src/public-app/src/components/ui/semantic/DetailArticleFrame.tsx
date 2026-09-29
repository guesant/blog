import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const DetailArticleFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'grid',
    rowGap: 'var(--site-page-content-offset)',
    paddingBlockStart: 0,
    paddingBlockEnd: { xs: 8, md: 10 },
    width: '100%',
    maxWidth: '100%',
    mx: 0,
  },
);
