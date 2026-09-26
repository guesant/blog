import type { Project } from '@portfolio/data/domain/types';
import { Typography } from '../ui';
import { Icon } from '../primitives/icon';
import { ConditionalContent } from '../primitives/conditional-content';
import type { CommonTranslator } from '@/i18n/compat-support';

type ProjectCardDetailsProps = {
  project: Project;
  headingLevel: 'h2' | 'h3';
  t: CommonTranslator;
};

export function ProjectCardDetails(props: ProjectCardDetailsProps) {
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {props.project.status}
      </Typography>
      <Typography
        className="project-card-title"
        component={props.headingLevel}
        variant="h3"
        visualVariant="projectCardSurface"
      >
        {props.project.name}
      </Typography>
      <Typography color="text.secondary" visualVariant="projectCardSurface2">
        {props.project.purpose}
      </Typography>
      <ConditionalContent
        condition={Boolean(props.project.problem)}
        content={
          <Typography visualVariant="projectCardSurface3">{props.project.problem}</Typography>
        }
      />
      <Typography visualVariant="projectCardSurface4">
        {props.project.technologies.join(' · ')}
      </Typography>
      <Typography color="secondary" visualVariant="projectCardSurface5">
        {props.t('explore')} <Icon name="north-east" size={15} />
      </Typography>
    </>
  );
}
