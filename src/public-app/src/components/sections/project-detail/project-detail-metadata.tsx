import type { ProjectsTranslator } from '@/i18n/compat-support';
import type { ProjectDetailContentProps } from './types';
import { ProjectDetailSource } from './project-detail-source';
import { ProjectDetailTechnologies } from './project-detail-technologies';
import { ProjectDetailContentFrame } from '../../ui/semantic/ProjectDetailContentFrame';

type ProjectDetailMetadataProps = {
  project: ProjectDetailContentProps['project'];
  t: ProjectsTranslator;
};

export function ProjectDetailMetadata(props: ProjectDetailMetadataProps) {
  if (props.project.technologies.length === 0 && !props.project.href?.trim()) {
    return null;
  }

  return (
    <ProjectDetailContentFrame>
      <ProjectDetailTechnologies technologies={props.project.technologies} t={props.t} />
      <ProjectDetailSource href={props.project.href} t={props.t} />
    </ProjectDetailContentFrame>
  );
}
