import type { ReactNode } from 'react';

type TraditionalFeedCardMetadataProps = { metadata: ReactNode };

export function TraditionalFeedCardMetadata(props: TraditionalFeedCardMetadataProps) {
  return props.metadata;
}
