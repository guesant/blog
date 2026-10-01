import { ContentActionsHeroStack } from '../ui/semantic/ContentActionsHeroStack';
import { ContentActionsItems } from './content-actions-items';
import type { ContentActionsItemsProps } from './content-actions-items-types';

type ContentActionsHeroProps = ContentActionsItemsProps;

export function ContentActionsHero(props: ContentActionsHeroProps) {
  return (
    <ContentActionsHeroStack direction="row">
      <ContentActionsItems {...props} />
    </ContentActionsHeroStack>
  );
}
