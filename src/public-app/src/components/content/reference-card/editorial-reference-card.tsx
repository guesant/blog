import { EditorialFeedItemFrame } from '../../ui';
import { ReferenceCardContent } from './reference-card-content';
import type { ReferenceCardProps } from './types';

type EditorialReferenceCardProps = ReferenceCardProps;

export function EditorialReferenceCard(props: EditorialReferenceCardProps) {
  return (
    <EditorialFeedItemFrame>
      <ReferenceCardContent {...props} />
    </EditorialFeedItemFrame>
  );
}
