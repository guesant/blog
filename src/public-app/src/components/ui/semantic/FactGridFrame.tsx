import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';
import { mergeSx } from '../sx';

const FactGridBase = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
    gap: 'var(--site-space-3)',
    margin: 0,
  },
);

type FactGridFrameProps = ComponentProps<typeof BaseComponent> & { singleColumn?: boolean };

export function FactGridFrame(props: FactGridFrameProps) {
  const { singleColumn, sx, ...rest } = props;

  return (
    <FactGridBase
      {...rest}
      sx={mergeSx(singleColumn ? { gridTemplateColumns: '1fr' } : {}, sx)}
    />
  );
}
