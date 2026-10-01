import { ContentActionsHero } from './content-actions-hero';
import { ContentActionsSection } from './content-actions-section';
import type { ContentActionsItemsProps } from './content-actions-items-types';

type ContentActionsPlacementProps = ContentActionsItemsProps & {
  placement: 'hero' | 'section';
};

export function ContentActionsPlacement(props: ContentActionsPlacementProps) {
  if (props.placement === 'hero') {
    return <ContentActionsHero {...props} />;
  }

  return <ContentActionsSection {...props} />;
}
