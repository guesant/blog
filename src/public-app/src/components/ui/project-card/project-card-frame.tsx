import type { ProjectCardFrameProps } from './project-card-frame-types';
import { Card } from '../card';

const frameStyles = {
  minHeight: '17rem',
  padding: 'var(--site-space-6)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-gap-stack)',
  backgroundColor: 'var(--site-surface)',
  borderColor: 'var(--site-border)',
  transition: 'border-color .2s, background-color .2s, transform .2s',
  '&:hover': {
    borderColor: 'var(--site-primary-hover)',
    backgroundColor: 'var(--site-surface-hover)',
    transform: 'translateY(-2px)',
  },
};

export function ProjectCardFrame(props: ProjectCardFrameProps) {
  return <Card {...props} sx={frameStyles} />;
}
