import { ActionSectionGrid } from './action-section-grid';
import { ActionSectionWithHeader } from './action-section-with-header';
import type { ActionSectionProps } from './types';

export function ActionSection(props: ActionSectionProps) {
  if (props.title) {
    return <ActionSectionWithHeader {...props} title={props.title} />;
  }

  return <ActionSectionGrid {...props} />;
}
