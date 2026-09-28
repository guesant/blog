'use client';

import { SourcePreviewListItemDetails } from './source-preview-list-item-details';
import { SourcePreviewListItemMedia } from './source-preview-list-item-media';
import type { SourcePreviewData, SourcePreviewTranslator } from './types';
import { SourcePreviewSurfaceFeedFrame } from '../../ui/semantic/SourcePreviewSurfaceFeedFrame';

type SourcePreviewListItemProps = {
  data: SourcePreviewData;
  onKindClick?: (data: SourcePreviewData) => void;
  t?: SourcePreviewTranslator;
};

export function SourcePreviewListItem(props: SourcePreviewListItemProps) {
  return (
    <SourcePreviewSurfaceFeedFrame>
      <SourcePreviewListItemMedia data={props.data} />
      <SourcePreviewListItemDetails data={props.data} onKindClick={props.onKindClick} t={props.t} />
    </SourcePreviewSurfaceFeedFrame>
  );
}
