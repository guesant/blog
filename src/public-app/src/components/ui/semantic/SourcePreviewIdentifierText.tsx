import type { ComponentProps } from 'react';
import { Typography } from '../typography';

type SourcePreviewIdentifierTextProps = ComponentProps<typeof Typography> & Record<string, unknown>;

export function SourcePreviewIdentifierText(props: SourcePreviewIdentifierTextProps) {
  const Component = Typography;

  return (
    <Component
      {...props}
      sx={[
        {
          display: 'block',
          minWidth: 0,
          maxWidth: '100%',
          color: 'var(--site-text-secondary)',
          fontSize: 'var(--site-text-xs)',
          overflowWrap: 'anywhere',
          whiteSpace: 'normal',
        },
        props.sx ?? {},
      ]}
    />
  );
}
