import { Typography } from '../../ui';
import type { ProjectsPageContentProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';

type ProjectsPageSelectedLabelProps = {
  page: ProjectsPageContentProps['page'];
  visible: boolean;
};

export function ProjectsPageSelectedLabel(props: ProjectsPageSelectedLabelProps) {
  return (
    <ConditionalContent
      condition={props.visible}
      content={
        <Typography variant="overline" color="text.secondary" visualVariant="selectedProjectsLabel">
          {props.page.selectedLabel}
        </Typography>
      }
    />
  );
}
