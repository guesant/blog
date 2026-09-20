'use client';

import { Box } from '../../ui';
import { SourcePreviewListItemDetails } from './source-preview-list-item-details';
import { SourcePreviewListItemMedia } from './source-preview-list-item-media';
import type { SourcePreviewData } from './types';
import { sourcePreviewVariantNames, type SourcePreviewVariant } from './source-preview-variant';

type SourcePreviewListItemProps = {
  data: SourcePreviewData;
  onKindClick?: (data: SourcePreviewData) => void;
  t?: (key: string, values?: Record<string, string | number>) => string;
  variant?: SourcePreviewVariant;
};

export function SourcePreviewListItem(props: SourcePreviewListItemProps) {
  const variant = props.variant ?? 'feed';

  return (
    <Box visualVariant={`sourcePreviewSurface${sourcePreviewVariantNames[variant]}`}>
      <SourcePreviewListItemMedia data={props.data} variant={variant} />
      <SourcePreviewListItemDetails
        data={props.data}
        onKindClick={props.onKindClick}
        t={props.t}
        variant={variant}
      />
    </Box>
  );
}
