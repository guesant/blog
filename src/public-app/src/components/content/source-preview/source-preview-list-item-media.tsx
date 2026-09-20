'use client';

import { Box } from '../../ui';
import { SourcePreviewListItemFallback } from './source-preview-list-item-fallback';
import type { SourcePreviewData } from './types';
import { sourcePreviewVariantNames, type SourcePreviewVariant } from './source-preview-variant';

type SourcePreviewListItemMediaProps = {
  data: SourcePreviewData;
  variant: SourcePreviewVariant;
};

export function SourcePreviewListItemMedia(props: SourcePreviewListItemMediaProps) {
  return (
    <Box visualVariant={`sourcePreviewMedia${sourcePreviewVariantNames[props.variant]}`}>
      {props.data.imageUrl ? (
        <Box
          component="img"
          src={props.data.imageUrl}
          alt={props.variant === 'detail' ? props.data.title : ''}
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
