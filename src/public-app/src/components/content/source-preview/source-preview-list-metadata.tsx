'use client';

import { Box } from '../../ui';
import { SourcePreviewListMetadataItem } from './source-preview-list-metadata-item';
import type { SourcePreviewMetadata } from './types';

type SourcePreviewListMetadataProps = { entries: SourcePreviewMetadata[] };

export function SourcePreviewListMetadata(props: SourcePreviewListMetadataProps) {
  return (
    <Box visualVariant="sourcePreviewListMetadata">
      {props.entries.map((entry) => (
        <SourcePreviewListMetadataItem key={`${entry.key}-${entry.value}`} entry={entry} />
      ))}
    </Box>
  );
}
