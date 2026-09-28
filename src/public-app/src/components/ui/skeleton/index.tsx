import type { ComponentProps } from 'react';
import BaseSkeleton from '@mui/material/Skeleton';

export type SkeletonProps = ComponentProps<typeof BaseSkeleton>;

export function Skeleton(props: SkeletonProps) {
  return <BaseSkeleton {...props} />;
}
