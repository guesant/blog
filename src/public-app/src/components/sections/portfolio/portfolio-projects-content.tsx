import { Box, Typography } from '../../ui';
import { ProjectCard } from '../../content/project-card';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { PortfolioPageContentProps } from './types';
import { PortfolioExperimentsLink } from './ui/experiments-link';
import { PortfolioProjectGrid } from './ui/project-grid';
import { PortfolioSectionDescription } from './ui/section-description';
import { PortfolioSectionTitle } from './ui/section-title';

type PortfolioProjectsContentProps = Pick<
  PortfolioPageContentProps,
  'page' | 'projects' | 'experiments'
>;

export function PortfolioProjectsContent(props: PortfolioProjectsContentProps) {
  return (
    <Box component="section">
      <Typography variant="overline" color="text.secondary">
        {props.page.projectsEyebrow}
      </Typography>
      <PortfolioSectionTitle>{props.page.projectsTitle}</PortfolioSectionTitle>
      <PortfolioSectionDescription>{props.page.projectsDescription}</PortfolioSectionDescription>
      <ConditionalContent
        condition={props.projects.length > 0}
        content={
          <PortfolioProjectGrid>
            {props.projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={project.slug} project={project} highlighted={index === 0} />
            ))}
          </PortfolioProjectGrid>
        }
      />
      <ConditionalContent
        condition={props.experiments.length > 0}
        content={
          <PortfolioExperimentsLink>
            {props.page.experimentsSummary.replace('{count}', String(props.experiments.length))}
          </PortfolioExperimentsLink>
        }
      />
    </Box>
  );
}
