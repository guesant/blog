'use client';

import { SourcePreviewListItemFallback } from './source-preview-list-item-fallback';
import type { SourcePreviewData } from './types';
import { SourcePreviewMediaFeedFrame } from '../../ui/semantic/SourcePreviewMediaFeedFrame';

type SourcePreviewListItemMediaProps = {
  data: SourcePreviewData;
};

export function SourcePreviewListItemMedia(props: SourcePreviewListItemMediaProps) {
  return (
    <SourcePreviewMediaFeedFrame>
      <SourcePreviewListItemFallback icon={props.data.icon} />
    </SourcePreviewMediaFeedFrame>
  );
}
