'use client';

import { Icon, type IconName } from '../../primitives/icon';
import { SourcePreviewListItemFallbackFrame } from '../../ui/semantic/SourcePreviewListItemFallbackFrame';

type SourcePreviewListItemFallbackProps = { icon: IconName };

export function SourcePreviewListItemFallback(props: SourcePreviewListItemFallbackProps) {
  return (
    <SourcePreviewListItemFallbackFrame>
      <Icon name={props.icon} size={20} />
    </SourcePreviewListItemFallbackFrame>
  );
}
