import type { ReactNode } from 'react';
import { Stack } from '../stack';

export type ListingListFrameProps = {
  children: ReactNode;
  separator?: ReactNode;
};

export function ListingListFrame(props: ListingListFrameProps) {
  return (
    <Stack
      sx={{
        rowGap: props.separator
          ? 'calc(var(--site-page-content-offset) / 2)'
          : 'var(--site-page-content-offset)',
      }}
    >
      {props.children}
    </Stack>
  );
}
