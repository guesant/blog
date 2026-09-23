'use client';

import { SectionHeading } from '../../content/section-heading';
import type { HomeProjectsSectionProps } from './types';
import { HomeSectionSurface } from './ui/home-section-surface';
import { HomeProjectsGrid } from './home-projects-grid';
import { HomeProjectsSummary } from './home-projects-summary';
import { useProgressiveCollection } from '../../../data/queries/use-progressive-collection';
import { ProgressiveCollectionFooter } from '../../content/progressive-collection/progressive-collection-footer';

export function HomeProjectsSection(props: HomeProjectsSectionProps) {
  const { projects, projectsPagination, experimentsCount, page, t } = props;

  const progressive = useProgressiveCollection({
    collection: 'projects',
    query: { featured: true, perPage: 3 },
    initialPage: { items: projects, meta: projectsPagination },
    queryKey: ['home', 'projects'],
    getKey: (item) => item.slug,
  });

  return (
    <HomeSectionSurface id="projects">
      <SectionHeading
        eyebrow={page.projectsEyebrow}
        title={page.projectsTitle}
        description={page.projectsDescription}
        href="/projects"
        linkLabel={t('projectsAction')}
      />
      <HomeProjectsGrid projects={progressive.items} />
      <ProgressiveCollectionFooter progressive={progressive} />
      <HomeProjectsSummary
        count={experimentsCount}
        summary={page.experimentsSummary}
        label="browseLab"
        t={t}
      />
    </HomeSectionSurface>
  );
}
