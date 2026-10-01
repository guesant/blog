import { ContentActionsSectionStack } from '../ui/semantic/ContentActionsSectionStack';
import { ContentActionsItems } from './content-actions-items';
import type { ContentActionsItemsProps } from './content-actions-items-types';

type ContentActionsSectionProps = ContentActionsItemsProps;

export function ContentActionsSection(props: ContentActionsSectionProps) {
  return (
    <ContentActionsSectionStack direction="row">
      <ContentActionsItems {...props} />
    </ContentActionsSectionStack>
  );
}
