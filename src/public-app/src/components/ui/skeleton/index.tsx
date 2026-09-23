import MuiSkeleton from '@mui/material/Skeleton';
import { createUiComponent, type UiProps } from '../ui-component';
import { skeletonVariants } from './variants';

export const Skeleton = createUiComponent<typeof MuiSkeleton>(function Skeleton(props: UiProps) {
  return <MuiSkeleton {...(props as Record<string, unknown>)} />;
}, skeletonVariants);
