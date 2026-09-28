import type { ReactNode } from 'react';
import { Stack } from '../stack';

export type ListingListFrameProps = {
  children: ReactNode;
};

export function ListingListFrame(props: ListingListFrameProps) {
  return <Stack sx={{ gap: 'var(--site-space-6)' }}>{props.children}</Stack>;
}
