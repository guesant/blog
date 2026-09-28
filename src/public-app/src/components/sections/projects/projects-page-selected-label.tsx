import type { ProjectsPageContentProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';
import { SelectedProjectsLabelText } from '../../ui/semantic/SelectedProjectsLabelText';

type ProjectsPageSelectedLabelProps = {
  page: ProjectsPageContentProps['page'];
  visible: boolean;
};

export function ProjectsPageSelectedLabel(props: ProjectsPageSelectedLabelProps) {
  return (
    <ConditionalContent
      condition={props.visible}
      content={
        <SelectedProjectsLabelText variant="overline" color="text.secondary">
          {props.page.selectedLabel}
        </SelectedProjectsLabelText>
      }
    />
  );
}
