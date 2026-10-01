import { FindingFeedCardFrame } from '../../ui';
import { ReferenceCardContent } from './reference-card-content';
import type { ReferenceCardProps } from './types';

type TraditionalReferenceCardProps = ReferenceCardProps;

export function TraditionalReferenceCard(props: TraditionalReferenceCardProps) {
  return (
    <FindingFeedCardFrame component="article">
      <ReferenceCardContent {...props} />
    </FindingFeedCardFrame>
  );
}
