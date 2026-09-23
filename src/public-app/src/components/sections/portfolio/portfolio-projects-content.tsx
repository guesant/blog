import { Box, Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { PortfolioPageContentProps } from './types';
import { PortfolioExperimentsLink } from './ui/experiments-link';
import { PortfolioSectionDescription } from './ui/section-description';
import { PortfolioSectionTitle } from './ui/section-title';
import { PortfolioProjectResults } from './portfolio-project-results';

type PortfolioProjectsContentProps = Pick<
  PortfolioPageContentProps,
  'page' | 'projects' | 'projectsPagination' | 'experiments' | 'experimentsPagination' | 'search'
>;

export function PortfolioProjectsContent(props: PortfolioProjectsContentProps) {
  return (
    <Box component="section">
      <Typography variant="overline" color="text.secondary">
        {props.page.projectsEyebrow}
      </Typography>
      <PortfolioSectionTitle>{props.page.projectsTitle}</PortfolioSectionTitle>
      <PortfolioSectionDescription>{props.page.projectsDescription}</PortfolioSectionDescription>
      <PortfolioProjectResults
        projects={props.projects}
        pagination={props.projectsPagination}
        search={props.search}
      />
      <ConditionalContent
        condition={props.experiments.length > 0}
        content={
          <PortfolioExperimentsLink>
            {props.page.experimentsSummary.replace(
              '{count}',
              String(props.experimentsPagination.total),
            )}
          </PortfolioExperimentsLink>
        }
      />
    </Box>
  );
}
