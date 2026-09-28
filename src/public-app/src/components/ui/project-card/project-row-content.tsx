import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { Typography } from '../typography';

type ProjectRowContentProps = {
  status: string;
  title: ReactNode;
  purpose: string;
  problem?: string;
  technologies: string;
};

const titleStyles = {
  fontSize: 'var(--site-text-xl)',
  fontWeight: 'var(--site-weight-semibold)',
};

const purposeStyles = { color: 'var(--site-text-secondary)' };

const technologiesStyles = { color: 'var(--site-text-secondary)' };

export function ProjectRowContent(props: ProjectRowContentProps) {
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {props.status}
      </Typography>
      <Typography component="h3" className="project-row-title" sx={titleStyles}>
        {props.title}
      </Typography>
      <Typography sx={purposeStyles}>{props.purpose}</Typography>
      <ConditionalContent
        condition={Boolean(props.problem)}
        content={<Typography>{props.problem}</Typography>}
      />
      <Typography sx={technologiesStyles}>{props.technologies}</Typography>
    </>
  );
}
