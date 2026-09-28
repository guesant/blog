import type { ReactNode } from 'react';
import { Stack } from '../stack';

export type ListingListFrameProps = {
  children: ReactNode;
};

export function ListingListFrame(props: ListingListFrameProps) {
  return <Stack sx={{ rowGap: 'var(--site-gap-stack)' }}>{props.children}</Stack>;
}
