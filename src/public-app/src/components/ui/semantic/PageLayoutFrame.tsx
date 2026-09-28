import type { ComponentProps } from 'react';
import { Box } from '../box';

type PageLayoutFrameProps = ComponentProps<typeof Box>;

export function PageLayoutFrame(props: PageLayoutFrameProps) {
  const Component = Box;

  return (
    <Component
      {...props}
      sx={[
        {
          display: 'flex',
          flex: 1,
          width: '100%',
          maxWidth: 'var(--site-content-max)',
          mx: 'auto',
          minWidth: 0,
          px: 'var(--site-inset-page)',
          boxSizing: 'border-box',
          backgroundColor: 'var(--grid-background)',
          flexDirection: 'column',
          gap: 'var(--site-page-content-offset)',
          pt: 'var(--site-page-content-offset) !important',
          pb: 'var(--site-space-6) !important',
        },
        props.sx ?? {},
      ]}
    />
  );
}
