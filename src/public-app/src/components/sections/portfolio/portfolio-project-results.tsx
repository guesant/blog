'use client';

import type { Project } from '@portfolio/data/domain/types';
import { Box } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ProjectCard } from '../../content/project-card';
import { PortfolioProjectGrid } from './ui/project-grid';

type PortfolioProjectResultsProps = {
  projects: Project[];
};

export function PortfolioProjectResults(props: PortfolioProjectResultsProps) {
  return (
    <ConditionalContent
      condition={props.projects.length > 0}
      content={
        <Box>
          <PortfolioProjectGrid>
            {props.projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </PortfolioProjectGrid>
        </Box>
      }
    />
  );
}
