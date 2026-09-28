import type { ComponentProps } from 'react';
import { Breadcrumbs } from '../breadcrumbs';
import { mergeSx } from '@/components/ui/sx';

type BreadcrumbsFrameProps = ComponentProps<typeof Breadcrumbs>;

export function BreadcrumbsFrame(props: BreadcrumbsFrameProps) {
  const Component = Breadcrumbs;

  return (
    <Component
      {...props}
      sx={mergeSx(
        {
          margin: 0,
          fontSize: 'var(--site-text-sm)',
          color: 'text.secondary',
          '& .MuiBreadcrumbs-li': { display: 'flex', alignItems: 'center' },
          '& .MuiBreadcrumbs-separator': { mx: 0.75, color: 'text.disabled' },
        },
        props.sx,
      )}
    />
  );
}
