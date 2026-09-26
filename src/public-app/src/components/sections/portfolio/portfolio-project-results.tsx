'use client';

import type { Project } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { Box } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ProjectCard } from '../../content/project-card';
import { ProgressiveCollectionFooter } from '../../content/progressive-collection/progressive-collection-footer';
import { PortfolioProjectGrid } from './ui/project-grid';
import { usePortfolioProgressiveCollection } from './use-portfolio-progressive-collection';

type PortfolioProjectResultsProps = {
  projects: Project[];
  pagination: ContentCollectionMeta;
  search: string;
};

export function PortfolioProjectResults(props: PortfolioProjectResultsProps) {
  const progressive = usePortfolioProgressiveCollection<Project>({
    collection: 'projects',
    items: props.projects,
    pagination: props.pagination,
    queryKey: 'projects',
    search: props.search,
    getKey: (item) => item.slug,
  });

  return (
    <ConditionalContent
      condition={progressive.items.length > 0}
      content={
        <Box>
          <PortfolioProjectGrid>
            {progressive.items.map((project, index) => (
              <ProjectCard key={project.slug} project={project} highlighted={index === 0} />
            ))}
          </PortfolioProjectGrid>
          <ProgressiveCollectionFooter progressive={progressive} />
        </Box>
      }
    />
  );
}
