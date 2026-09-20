'use client';

import { Box } from '../../ui';
import { SourcePreviewListItem } from './source-preview-list-item';
import type { SourcePreviewData } from './types';
import type { SourcePreviewVariant } from './source-preview-variant';

type SourcePreviewListGroupProps = {
  entries: SourcePreviewData[];
  onKindClick?: (data: SourcePreviewData) => void;
  variant?: SourcePreviewVariant;
};

export function SourcePreviewListGroup(props: SourcePreviewListGroupProps) {
  return (
    <Box visualVariant="sourcePreviewListGroup">
      {props.entries.map((entry) => (
        <SourcePreviewListItem
          key={entry.url}
          data={entry}
          onKindClick={props.onKindClick}
          variant={props.variant}
        />
      ))}
    </Box>
  );
}
