import { ProgressiveItemSkeleton } from '../../ui/semantic/ProgressiveItemSkeleton';
import { ProgressiveSkeletonStack } from '../../ui/semantic/ProgressiveSkeletonStack';

export function ProgressiveCollectionSkeleton() {
  return (
    <ProgressiveSkeletonStack aria-busy="true">
      <ProgressiveItemSkeleton />
      <ProgressiveItemSkeleton />
      <ProgressiveItemSkeleton />
    </ProgressiveSkeletonStack>
  );
}
