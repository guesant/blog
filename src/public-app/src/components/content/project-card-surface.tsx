'use client';

import type { Project } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { Card } from '../ui';
import { NavLink } from '../primitives/nav-link';
import { ProjectCardDetails } from './project-card-details';

type ProjectCardSurfaceProps = {
  project: Project;
  highlighted?: boolean;
  headingLevel?: 'h2' | 'h3';
};

export function ProjectCardSurface(props: ProjectCardSurfaceProps) {
  const { project, highlighted = false, headingLevel = 'h3' } = props;

  const t = useTranslations('Common');

  const content = project;

  return (
    <Card
      component={NavLink}
      href={content.url ?? `/projects/${content.slug}`}
      underline="none"
      color="inherit"
      visualVariant={highlighted ? 'projectCardHighlighted' : 'projectCardPlain'}
    >
      <ProjectCardDetails project={content} headingLevel={headingLevel} t={t} />
    </Card>
  );
}
