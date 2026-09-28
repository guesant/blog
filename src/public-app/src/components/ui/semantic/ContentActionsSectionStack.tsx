import type { ComponentProps } from 'react';
import { Stack } from '../stack';
import { mergeSx } from '@/components/ui/sx';

type ContentActionsSectionStackProps = ComponentProps<typeof Stack>;

export function ContentActionsSectionStack(props: ContentActionsSectionStackProps) {
  const Component = Stack;

  return (
    <Component
      {...props}
      sx={mergeSx(
        { mt: 'var(--site-space-4)', flexWrap: 'wrap', gap: 'var(--site-space-2)' },
        props.sx,
      )}
    />
  );
}
