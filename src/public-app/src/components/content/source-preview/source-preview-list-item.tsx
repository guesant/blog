'use client';

import { SourcePreviewListItemDetails } from './source-preview-list-item-details';
import type { SourcePreviewData, SourcePreviewTranslator } from './types';

type SourcePreviewListItemProps = {
  data: SourcePreviewData;
  onKindClick?: (data: SourcePreviewData) => void;
  t?: SourcePreviewTranslator;
};

export function SourcePreviewListItem(props: SourcePreviewListItemProps) {
  return (
    <SourcePreviewListItemDetails data={props.data} onKindClick={props.onKindClick} t={props.t} />
  );
}
