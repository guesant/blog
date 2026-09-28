import type { ElementType, ReactNode } from 'react';
import { Card } from '../card';

type ProjectCardFrameProps = {
  children: ReactNode;
  component?: ElementType;
  href?: string;
  underline?: 'none' | 'hover' | 'always';
  color?: string;
  emphasis: 'highlighted' | 'plain';
};

const sharedStyles = {
  minHeight: '17rem',
  padding: 'var(--site-space-6)',
  display: 'flex',
  flexDirection: 'column',
  transition: 'border-color .2s, background-color .2s, transform .2s',
  '&:hover': {
    borderColor: 'rgba(29,95,167,.55)',
    transform: 'translateY(-2px)',
  },
};

const frameStyles = {
  highlighted: {
    ...sharedStyles,
    backgroundColor: '#EAF2FA',
    borderColor: 'rgba(29,95,167,.28)',
    '&:hover': { ...sharedStyles['&:hover'], backgroundColor: '#E1EDF8' },
  },
  plain: {
    ...sharedStyles,
    backgroundColor: 'rgba(255,255,255,.72)',
    borderColor: 'divider',
    '&:hover': { ...sharedStyles['&:hover'], backgroundColor: 'background.paper' },
  },
};

export function ProjectCardFrame(props: ProjectCardFrameProps) {
  const { emphasis, ...cardProps } = props;

  return <Card {...cardProps} sx={frameStyles[emphasis]} />;
}
