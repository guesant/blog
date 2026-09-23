import type { RefObject } from 'react';
import { Button, Stack, VisibilitySentinel } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ProgressiveCollectionSkeleton } from './progressive-collection-skeleton';

type ProgressiveCollectionFooterViewProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  retryLabel: string;
  onRetry: () => void;
  sentinelRef: RefObject<HTMLSpanElement | null>;
};

export function ProgressiveCollectionFooterView(props: ProgressiveCollectionFooterViewProps) {
  return (
    <ConditionalContent
      condition={props.hasNextPage || props.isFetchingNextPage || props.isFetchNextPageError}
      content={
        <Stack visualVariant="progressiveFooter">
          <ConditionalContent
            condition={props.isFetchNextPageError}
            content={
              <Button variant="outlined" onClick={props.onRetry}>
                {props.retryLabel}
              </Button>
            }
          />
          <ConditionalContent
            condition={props.isFetchingNextPage}
            content={<ProgressiveCollectionSkeleton />}
          />
          <ConditionalContent
            condition={
              props.hasNextPage && !props.isFetchingNextPage && !props.isFetchNextPageError
            }
            content={<VisibilitySentinel ref={props.sentinelRef} />}
          />
        </Stack>
      }
    />
  );
}
