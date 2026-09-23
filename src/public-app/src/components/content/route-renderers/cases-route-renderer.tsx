import { CasesPageContent } from '../../sections/cases';
import { createRouteRenderer } from './create-route-renderer';

export const CasesRouteRenderer = createRouteRenderer({
  kind: 'cases',
  render: (data) => (
    <CasesPageContent page={data.page} items={data.items} pagination={data.pagination} />
  ),
});
