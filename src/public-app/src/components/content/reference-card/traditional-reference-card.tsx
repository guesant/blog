import { FindingReferenceCardFrame } from '../../ui';
import { ReferenceCardContent } from './reference-card-content';
import type { ReferenceCardProps } from './types';

type TraditionalReferenceCardProps = ReferenceCardProps;

export function TraditionalReferenceCard(props: TraditionalReferenceCardProps) {
  return (
    <FindingReferenceCardFrame>
      <ReferenceCardContent {...props} />
    </FindingReferenceCardFrame>
  );
}
