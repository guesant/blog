import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const HomeIntroText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    ...{
      display: 'block',
      width: '100%',
      maxWidth: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxSizing: 'border-box',
      ...{ textAlign: 'justify', hyphens: 'auto' },
    },
    margin: 0,
    fontFamily: 'var(--site-font-action)',
    fontSize: 'var(--site-text-lg)',
    fontWeight: 'var(--site-weight-medium)',
    lineHeight: 'var(--site-leading-relaxed)',
    color: 'text.secondary',
  },
);
