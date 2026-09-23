'use client';

import { useTranslations } from '@/i18n/compat';
import { ProgressiveCollectionFooterView } from './progressive-collection-footer-view';
import { useProgressiveCollectionSentinel } from './use-progressive-collection-sentinel';

type ProgressiveCollectionFooterState = {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => Promise<unknown>;
};

type ProgressiveCollectionFooterProps = {
  progressive: ProgressiveCollectionFooterState;
};

export function ProgressiveCollectionFooter(props: ProgressiveCollectionFooterProps) {
  const t = useTranslations('Pages.error');

  const sentinelRef = useProgressiveCollectionSentinel({
    enabled:
      Boolean(props.progressive.hasNextPage) &&
      !props.progressive.isFetchingNextPage &&
      !props.progressive.isFetchNextPageError,
    onLoadMore: () => void props.progressive.fetchNextPage(),
  });

  return (
    <ProgressiveCollectionFooterView
      hasNextPage={Boolean(props.progressive.hasNextPage)}
      isFetchingNextPage={props.progressive.isFetchingNextPage}
      isFetchNextPageError={props.progressive.isFetchNextPageError}
      retryLabel={t('retry')}
      onRetry={() => void props.progressive.fetchNextPage()}
      sentinelRef={sentinelRef}
    />
  );
}
