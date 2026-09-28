import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { Typography } from '../typography';

type ProjectCardContentProps = {
  status: string;
  name: ReactNode;
  headingLevel: 'h2' | 'h3';
  purpose: string;
  problem?: string;
  technologies: string;
  action: ReactNode;
};

const titleStyles = {
  marginBlockStart: 'var(--site-space-3)',
  fontSize: '1.25rem',
  transition: 'color .2s',
};

const purposeStyles = {
  marginBlockStart: 'var(--site-space-2)',
  fontSize: '.9rem',
  maxWidth: '48ch',
};

const problemStyles = { marginBlockStart: 'var(--site-space-4)', fontSize: '.85rem' };

const technologiesStyles = {
  marginBlockStart: 'auto',
  paddingBlockStart: 'var(--site-space-6)',
  color: 'text.secondary',
  fontSize: '.8rem',
};

const actionStyles = {
  marginBlockStart: 'var(--site-space-4)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-space-2)',
  fontWeight: 'var(--site-weight-semibold)',
};

export function ProjectCardContent(props: ProjectCardContentProps) {
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {props.status}
      </Typography>
      <Typography component={props.headingLevel} sx={titleStyles} className="project-card-title">
        {props.name}
      </Typography>
      <Typography color="text.secondary" sx={purposeStyles}>
        {props.purpose}
      </Typography>
      <ConditionalContent
        condition={Boolean(props.problem)}
        content={<Typography sx={problemStyles}>{props.problem}</Typography>}
      />
      <Typography sx={technologiesStyles}>{props.technologies}</Typography>
      <Typography color="secondary" sx={actionStyles}>
        {props.action}
      </Typography>
    </>
  );
}
