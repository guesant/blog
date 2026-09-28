'use client';

import { SourcePreviewListItemFallback } from './source-preview-list-item-fallback';
import type { SourcePreviewData } from './types';
import { SourcePreviewListItemMediaFrame } from '../../ui/semantic/SourcePreviewListItemMediaFrame';
import { SourcePreviewMediaFeedFrame } from '../../ui/semantic/SourcePreviewMediaFeedFrame';

type SourcePreviewListItemMediaProps = {
  data: SourcePreviewData;
};

export function SourcePreviewListItemMedia(props: SourcePreviewListItemMediaProps) {
  return (
    <SourcePreviewMediaFeedFrame>
      {props.data.imageUrl ? (
        <SourcePreviewListItemMediaFrame
          component="img"
          src={props.data.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : (
        <SourcePreviewListItemFallback icon={props.data.icon} />
      )}
    </SourcePreviewMediaFeedFrame>
  );
}
