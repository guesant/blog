import { Typography } from '../../ui';
import type { ProjectsTranslator } from '@/i18n/compat-support';
import type { ProjectDetailContentProps } from './types';
import { ProjectTechnologyListText } from '../../ui/semantic/ProjectTechnologyListText';
import { ProjectDetailMetadataFrame } from '../../ui/semantic/ProjectDetailMetadataFrame';

type ProjectDetailTechnologiesProps = {
  technologies: ProjectDetailContentProps['project']['technologies'];
  t: ProjectsTranslator;
};

export function ProjectDetailTechnologies(props: ProjectDetailTechnologiesProps) {
  if (props.technologies.length === 0) {
    return null;
  }

  return (
    <ProjectDetailMetadataFrame>
      <Typography variant="overline" color="text.secondary">
        {props.t('technologies')}
      </Typography>
      <ProjectTechnologyListText color="text.secondary">
        {props.technologies.join(' · ')}
      </ProjectTechnologyListText>
    </ProjectDetailMetadataFrame>
  );
}
