'use client';

import { SourcePreviewListMetadataItem } from './source-preview-list-metadata-item';
import type { SourcePreviewMetadata } from './types';
import { SourcePreviewListMetadataFrame } from '../../ui/semantic/SourcePreviewListMetadataFrame';

type SourcePreviewListMetadataProps = { entries: SourcePreviewMetadata[] };

export function SourcePreviewListMetadata(props: SourcePreviewListMetadataProps) {
  return (
    <SourcePreviewListMetadataFrame>
      {props.entries.map((entry) => (
        <SourcePreviewListMetadataItem key={`${entry.key}-${entry.value}`} entry={entry} />
      ))}
    </SourcePreviewListMetadataFrame>
  );
}
