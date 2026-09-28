import { Typography } from '../../ui';
import type { ProjectsTranslator } from '@/i18n/compat-support';
import type { ProjectDetailContentProps } from './types';
import { ProjectDetailContent2Text } from '../../ui/semantic/ProjectDetailContent2Text';
import { ProjectDetailContentFrame } from '../../ui/semantic/ProjectDetailContentFrame';

type ProjectDetailTechnologiesProps = {
  technologies: ProjectDetailContentProps['project']['technologies'];
  t: ProjectsTranslator;
};

export function ProjectDetailTechnologies(props: ProjectDetailTechnologiesProps) {
  if (props.technologies.length === 0) {
    return null;
  }

  return (
    <ProjectDetailContentFrame>
      <Typography variant="overline" color="text.secondary">
        {props.t('technologies')}
      </Typography>
      <ProjectDetailContent2Text color="text.secondary">
        {props.technologies.join(' · ')}
      </ProjectDetailContent2Text>
    </ProjectDetailContentFrame>
  );
}
