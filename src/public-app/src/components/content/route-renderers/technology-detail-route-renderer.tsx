import { TechnologyDetailPageContent } from '../../sections/technologies';
import { createRouteRenderer } from './create-route-renderer';

export const TechnologyDetailRouteRenderer = createRouteRenderer({
  kind: 'technology-detail',
  render: (data) => <TechnologyDetailPageContent technology={data.technology} />,
});
