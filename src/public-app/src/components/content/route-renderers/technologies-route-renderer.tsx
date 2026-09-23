import { TechnologiesPageContent } from '../../sections/technologies';
import { createRouteRenderer } from './create-route-renderer';

export const TechnologiesRouteRenderer = createRouteRenderer({
  kind: 'technologies',
  render: (data) => (
    <TechnologiesPageContent technologies={data.technologies} pagination={data.pagination} />
  ),
});
