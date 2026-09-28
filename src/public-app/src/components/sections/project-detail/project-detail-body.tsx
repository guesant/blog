import { ContentRichText } from '../../content/content-rich-text';
import type { ProjectDetailContentProps } from './types';
import { ProjectDetailContent2Frame } from '../../ui/semantic/ProjectDetailContent2Frame';

type ProjectDetailBodyProps = {
  body: ProjectDetailContentProps['project']['body'];
};

export function ProjectDetailBody(props: ProjectDetailBodyProps) {
  if (!props.body) {
    return null;
  }

  return (
    <ProjectDetailContent2Frame>
      <ContentRichText content={props.body} />
    </ProjectDetailContent2Frame>
  );
}
