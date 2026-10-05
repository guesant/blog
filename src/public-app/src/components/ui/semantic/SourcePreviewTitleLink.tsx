import type { ComponentProps } from 'react';
import { ExternalLink } from '@/components/primitives/external-link';
import { mergeSx } from '@/components/ui/sx';

type SourcePreviewTitleLinkProps = ComponentProps<typeof ExternalLink>;

export function SourcePreviewTitleLink(props: SourcePreviewTitleLinkProps) {
  return (
    <ExternalLink
      {...props}
      sx={mergeSx(
        {
          color: 'var(--site-primary)',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          lineHeight: 'inherit',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        },
        props.sx,
      )}
    />
  );
}
