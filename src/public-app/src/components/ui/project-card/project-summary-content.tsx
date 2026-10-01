import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { Typography } from '../typography';

export type ProjectSummaryContentProps = {
  status: string;
  title: ReactNode;
  headingLevel: 'h2' | 'h3';
  purpose: string;
  problem?: string;
  technologies: string;
  action?: ReactNode;
};

const titleStyles = {
  fontSize: 'var(--site-text-xl)',
  fontWeight: 'var(--site-weight-semibold)',
  transition: 'color .2s',
};

const purposeStyles = {
  color: 'var(--site-text-secondary)',
};

const problemStyles = {
  color: 'var(--site-text-secondary)',
};

const technologiesStyles = {
  color: 'var(--site-text-secondary)',
};

const actionStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-space-2)',
  fontWeight: 'var(--site-weight-semibold)',
};

export function ProjectSummaryContent(props: ProjectSummaryContentProps) {
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {props.status}
      </Typography>
      <Typography component={props.headingLevel} sx={titleStyles} className="project-summary-title">
        {props.title}
      </Typography>
      <Typography sx={purposeStyles}>{props.purpose}</Typography>
      <ConditionalContent
        condition={Boolean(props.problem)}
        content={<Typography sx={problemStyles}>{props.problem}</Typography>}
      />
      <Typography sx={technologiesStyles}>{props.technologies}</Typography>
      <ConditionalContent
        condition={props.action !== undefined}
        content={
          <Typography color="secondary" sx={actionStyles}>
            {props.action}
          </Typography>
        }
      />
    </>
  );
}
