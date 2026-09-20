import { Box } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import type { ProjectDetailContentProps } from './types';

type ProjectDetailBodyProps = {
  body: ProjectDetailContentProps['project']['body'];
};

export function ProjectDetailBody(props: ProjectDetailBodyProps) {
  if (!props.body) {
    return null;
  }

  return (
    <Box visualVariant="projectDetailContent2">
      <ContentRichText content={props.body} />
    </Box>
  );
}
