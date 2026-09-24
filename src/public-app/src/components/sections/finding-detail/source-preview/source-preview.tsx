'use client';

import { SourcePreviewListItem } from '../../../content/source-preview/source-preview-list-item';
import type {
  SourcePreviewData,
  SourcePreviewTranslator,
} from '../../../content/source-preview/types';

type SourcePreviewProps = { data: SourcePreviewData; t: SourcePreviewTranslator };

export function SourcePreview(props: SourcePreviewProps) {
  return <SourcePreviewListItem data={props.data} t={props.t} />;
}
