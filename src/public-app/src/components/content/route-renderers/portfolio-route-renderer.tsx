import { PortfolioPageContent } from '../../sections/portfolio';
import type { RouteRendererProps } from './route-renderers.types';

type PortfolioRouteRendererProps = RouteRendererProps;

export function PortfolioRouteRenderer(props: PortfolioRouteRendererProps) {
  if (props.data.kind !== 'portfolio') {
    return null;
  }

  return (
    <PortfolioPageContent
      page={props.data.page}
      profile={props.data.profile}
      cases={props.data.cases}
      casesPagination={props.data.casesPagination}
      projects={props.data.projects}
      projectsPagination={props.data.projectsPagination}
      experiments={props.data.experiments}
      experimentsPagination={props.data.experimentsPagination}
    />
  );
}
