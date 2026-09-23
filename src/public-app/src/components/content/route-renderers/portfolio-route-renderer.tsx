import { PortfolioPageContent } from '../../sections/portfolio';
import { createRouteRenderer } from './create-route-renderer';

export const PortfolioRouteRenderer = createRouteRenderer({
  kind: 'portfolio',
  render: (data) => (
    <PortfolioPageContent
      page={data.page}
      profile={data.profile}
      cases={data.cases}
      casesPagination={data.casesPagination}
      projects={data.projects}
      projectsPagination={data.projectsPagination}
      experiments={data.experiments}
      experimentsPagination={data.experimentsPagination}
      search={data.search}
    />
  ),
});
