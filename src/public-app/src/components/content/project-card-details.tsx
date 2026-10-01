import type { Project } from '@portfolio/data/domain/types';
import { Icon } from '../primitives/icon';
import { ProjectSummaryContent } from '../ui';
import type { CommonTranslator } from '@/i18n/compat-support';

type ProjectCardDetailsProps = {
  project: Project;
  headingLevel: 'h2' | 'h3';
  t: CommonTranslator;
};

export function ProjectCardDetails(props: ProjectCardDetailsProps) {
  return (
    <ProjectSummaryContent
      status={props.project.status}
      title={props.project.name}
      headingLevel={props.headingLevel}
      purpose={props.project.purpose}
      problem={props.project.problem}
      technologies={props.project.technologies.join(' · ')}
      action={
        <>
          {props.t('explore')} <Icon name="north-east" size={15} />
        </>
      }
    />
  );
}
