import type { ComponentProps } from 'react';
import { Typography } from '../typography';

type SourcePreviewMetadataTextProps = ComponentProps<typeof Typography> & Record<string, unknown>;

export function SourcePreviewMetadataText(props: SourcePreviewMetadataTextProps) {
  const Component = Typography;

  return (
    <Component
      {...props}
      sx={[
        {
          minWidth: 0,
          maxWidth: '100%',
          color: 'var(--site-text-secondary)',
          fontSize: 'var(--site-text-xs)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        props.sx ?? {},
      ]}
    />
  );
}
