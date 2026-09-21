'use client';

import { SectionHeading } from '../../content/section-heading';
import type { HomeProjectsSectionProps } from './types';
import { HomeSectionSurface } from './ui/home-section-surface';
import { HomeProjectsGrid } from './home-projects-grid';
import { HomeProjectsSummary } from './home-projects-summary';

export function HomeProjectsSection(props: HomeProjectsSectionProps) {
  const { projects, experimentsCount, page, t } = props;

  return (
    <HomeSectionSurface id="projects">
      <SectionHeading
        eyebrow={page.projectsEyebrow}
        title={page.projectsTitle}
        description={page.projectsDescription}
        href="/projects"
        linkLabel={t('projectsAction')}
      />
      <HomeProjectsGrid projects={projects} />
      <HomeProjectsSummary
        count={experimentsCount}
        summary={page.experimentsSummary}
        label="browseLab"
        t={t}
      />
    </HomeSectionSurface>
  );
}
