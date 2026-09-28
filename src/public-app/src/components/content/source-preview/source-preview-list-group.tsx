'use client';

import { SourcePreviewListItem } from './source-preview-list-item';
import type { SourcePreviewData } from './types';
import { SourcePreviewListGroupFrame } from '../../ui/semantic/SourcePreviewListGroupFrame';

type SourcePreviewListGroupProps = {
  entries: SourcePreviewData[];
  onKindClick?: (data: SourcePreviewData) => void;
};

export function SourcePreviewListGroup(props: SourcePreviewListGroupProps) {
  return (
    <SourcePreviewListGroupFrame>
      {props.entries.map((entry) => (
        <SourcePreviewListItem key={entry.url} data={entry} onKindClick={props.onKindClick} />
      ))}
    </SourcePreviewListGroupFrame>
  );
}
