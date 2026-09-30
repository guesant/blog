import type { ReactNode } from 'react';
import { FindingCardMetadataBlock } from '../../ui';

type EditorialFeedCardMetadataProps = {
  metadata: ReactNode;
  tags: ReactNode;
};

export function EditorialFeedCardMetadata(props: EditorialFeedCardMetadataProps) {
  return (
    <FindingCardMetadataBlock>
      {props.metadata}
      {props.tags}
    </FindingCardMetadataBlock>
  );
}
