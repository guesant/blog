import type { ReactNode } from 'react';
import { Stack } from '../stack';

export type ListingViewFrameProps = {
  children: ReactNode;
};

export function ListingViewFrame(props: ListingViewFrameProps) {
  return (
    <Stack
      sx={{
        gap: 'var(--site-space-4)',
      }}
    >
      {props.children}
    </Stack>
  );
}
