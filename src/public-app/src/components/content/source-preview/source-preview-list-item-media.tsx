'use client';

import { Box } from '../../ui';
import { SourcePreviewListItemFallback } from './source-preview-list-item-fallback';
import type { SourcePreviewData } from './types';

type SourcePreviewListItemMediaProps = {
  data: SourcePreviewData;
};

export function SourcePreviewListItemMedia(props: SourcePreviewListItemMediaProps) {
  return (
    <Box visualVariant="sourcePreviewMediaFeed">
      {props.data.imageUrl ? (
        <Box
          component="img"
          src={props.data.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          visualVariant="sourcePreviewListItemMedia"
        />
      ) : (
        <SourcePreviewListItemFallback icon={props.data.icon} />
      )}
    </Box>
  );
}
