import type { Project } from '@portfolio/data/domain/types';
import { Icon } from '../primitives/icon';
import { Typography } from '../ui';
import type { CommonTranslator } from '@/i18n/compat-support';
import { ProjectSummary } from './project-summary';

type ProjectCardDetailsProps = {
  project: Project;
  headingLevel: 'h2' | 'h3';
  t: CommonTranslator;
};

export function ProjectCardDetails(props: ProjectCardDetailsProps) {
  return (
    <>
      <ProjectSummary
        project={props.project}
        headingLevel={props.headingLevel}
        titleContent={props.project.name}
        titleVariant="h3"
        titleClassName="project-card-title"
        titleVisualVariant="projectCardSurface"
        purposeVisualVariant="projectCardSurface2"
        problemVisualVariant="projectCardSurface3"
        technologiesVisualVariant="projectCardSurface4"
      />
      <Typography color="secondary" visualVariant="projectCardSurface5">
        {props.t('explore')} <Icon name="north-east" size={15} />
      </Typography>
    </>
  );
}
