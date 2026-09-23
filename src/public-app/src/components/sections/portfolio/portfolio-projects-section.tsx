import { ConditionalContent } from '../../primitives/conditional-content';
import type { PortfolioPageContentProps } from './types';
import { PortfolioProjectsContent } from './portfolio-projects-content';

type PortfolioProjectsSectionProps = Pick<
  PortfolioPageContentProps,
  'page' | 'projects' | 'projectsPagination' | 'experiments' | 'experimentsPagination' | 'search'
>;

export function PortfolioProjectsSection(props: PortfolioProjectsSectionProps) {
  return (
    <ConditionalContent
      condition={props.projects.length > 0 || props.experiments.length > 0}
      content={<PortfolioProjectsContent {...props} />}
    />
  );
}
