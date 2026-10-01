import { ContentRichText } from '../../content/content-rich-text';
import type { ProjectDetailContentProps } from './types';
import { ProjectBodyRichTextFrame } from '../../ui/semantic/ProjectBodyRichTextFrame';

type ProjectDetailBodyProps = {
  body: ProjectDetailContentProps['project']['body'];
};

export function ProjectDetailBody(props: ProjectDetailBodyProps) {
  if (!props.body) {
    return null;
  }

  return (
    <ProjectBodyRichTextFrame>
      <ContentRichText content={props.body} />
    </ProjectBodyRichTextFrame>
  );
}
