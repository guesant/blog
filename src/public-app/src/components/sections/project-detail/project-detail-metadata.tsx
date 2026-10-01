import type { ProjectsTranslator } from '@/i18n/compat-support';
import type { ProjectDetailContentProps } from './types';
import { ProjectDetailSource } from './project-detail-source';
import { ProjectDetailTechnologies } from './project-detail-technologies';
import { ProjectDetailMetadataFrame } from '../../ui/semantic/ProjectDetailMetadataFrame';

type ProjectDetailMetadataProps = {
  project: ProjectDetailContentProps['project'];
  t: ProjectsTranslator;
};

export function ProjectDetailMetadata(props: ProjectDetailMetadataProps) {
  if (props.project.technologies.length === 0 && !props.project.href?.trim()) {
    return null;
  }

  return (
    <ProjectDetailMetadataFrame>
      <ProjectDetailTechnologies technologies={props.project.technologies} t={props.t} />
      <ProjectDetailSource href={props.project.href} t={props.t} />
    </ProjectDetailMetadataFrame>
  );
}
