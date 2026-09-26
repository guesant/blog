'use client';

import { Box } from '../../ui';
import { SourcePreviewListItemDetails } from './source-preview-list-item-details';
import { SourcePreviewListItemMedia } from './source-preview-list-item-media';
import type { SourcePreviewData, SourcePreviewTranslator } from './types';

type SourcePreviewListItemProps = {
  data: SourcePreviewData;
  onKindClick?: (data: SourcePreviewData) => void;
  t?: SourcePreviewTranslator;
};

export function SourcePreviewListItem(props: SourcePreviewListItemProps) {
  return (
    <Box visualVariant="sourcePreviewSurfaceFeed">
      <SourcePreviewListItemMedia data={props.data} />
      <SourcePreviewListItemDetails data={props.data} onKindClick={props.onKindClick} t={props.t} />
    </Box>
  );
}
