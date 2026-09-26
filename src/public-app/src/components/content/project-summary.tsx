import type { Project } from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';
import { ConditionalContent } from '../primitives/conditional-content';
import { Typography } from '../ui';

type ProjectSummaryProps = {
  project: Project;
  headingLevel: 'h2' | 'h3';
  titleContent: ReactNode;
  titleVariant?: 'h3';
  titleClassName?: string;
  titleVisualVariant?: string;
  purposeVisualVariant?: string;
  problemVisualVariant?: string;
  technologiesVisualVariant?: string;
  technologiesColor?: string;
};

export function ProjectSummary(props: ProjectSummaryProps) {
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {props.project.status}
      </Typography>
      <Typography
        className={props.titleClassName}
        component={props.headingLevel}
        variant={props.titleVariant}
        visualVariant={props.titleVisualVariant}
      >
        {props.titleContent}
      </Typography>
      <Typography color="text.secondary" visualVariant={props.purposeVisualVariant}>
        {props.project.purpose}
      </Typography>
      <ConditionalContent
        condition={Boolean(props.project.problem)}
        content={
          <Typography visualVariant={props.problemVisualVariant}>
            {props.project.problem}
          </Typography>
        }
      />
      <Typography color={props.technologiesColor} visualVariant={props.technologiesVisualVariant}>
        {props.project.technologies.join(' · ')}
      </Typography>
    </>
  );
}
