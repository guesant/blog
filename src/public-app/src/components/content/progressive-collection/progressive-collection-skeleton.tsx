import { Skeleton, Stack } from '../../ui';

export function ProgressiveCollectionSkeleton() {
  return (
    <Stack visualVariant="progressiveSkeleton" aria-busy="true">
      <Skeleton visualVariant="progressiveItem" />
      <Skeleton visualVariant="progressiveItem" />
      <Skeleton visualVariant="progressiveItem" />
    </Stack>
  );
}
