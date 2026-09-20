'use client';

import { Box } from '../../ui';
import { Icon, type IconName } from '../../primitives/icon';

type SourcePreviewListItemFallbackProps = { icon: IconName };

export function SourcePreviewListItemFallback(props: SourcePreviewListItemFallbackProps) {
  return (
    <Box visualVariant="sourcePreviewListItemFallback">
      <Icon name={props.icon} size={20} />
    </Box>
  );
}
