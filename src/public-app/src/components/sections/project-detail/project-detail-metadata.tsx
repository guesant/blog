import { Box } from '../../ui';
import type { useTranslations } from '@/i18n/compat';
import type { ProjectDetailContentProps } from './types';
import { ProjectDetailSource } from './project-detail-source';
import { ProjectDetailTechnologies } from './project-detail-technologies';

type ProjectDetailMetadataProps = {
  project: ProjectDetailContentProps['project'];
  t: ReturnType<typeof useTranslations>;
};

export function ProjectDetailMetadata(props: ProjectDetailMetadataProps) {
  if (props.project.technologies.length === 0 && !props.project.href?.trim()) {
    return null;
  }

  return (
    <Box visualVariant="projectDetailContent">
      <ProjectDetailTechnologies technologies={props.project.technologies} t={props.t} />
      <ProjectDetailSource href={props.project.href} t={props.t} />
    </Box>
  );
}
