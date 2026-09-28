import type { ComponentProps } from 'react';
import { Stack } from '../stack';
import { mergeSx } from '@/components/ui/sx';

type ContentActionsHeroStackProps = ComponentProps<typeof Stack>;

export function ContentActionsHeroStack(props: ContentActionsHeroStackProps) {
  const Component = Stack;

  return (
    <Component
      {...props}
      sx={mergeSx({ mt: 0, flexWrap: 'wrap', gap: 'var(--site-space-2)' }, props.sx)}
    />
  );
}
