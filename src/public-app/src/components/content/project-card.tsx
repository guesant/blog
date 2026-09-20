'use client';

import type { Project } from '@portfolio/data/domain/types';
import { ScrollReveal } from '../primitives/scroll-reveal';
import { ProjectCardSurface } from './project-card-surface';

type ProjectCardProps = { project: Project; highlighted?: boolean; headingLevel?: 'h2' | 'h3' };

export function ProjectCard(props: ProjectCardProps) {
  return (
    <ScrollReveal>
      <ProjectCardSurface {...props} />
    </ScrollReveal>
  );
}
