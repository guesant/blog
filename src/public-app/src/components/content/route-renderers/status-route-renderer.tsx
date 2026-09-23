import { StatusPage } from '../../sections/status';
import { createRouteRenderer } from './create-route-renderer';

export const StatusRouteRenderer = createRouteRenderer({
  kind: 'status',
  render: (data) => (
    <StatusPage kind={data.status} sourceRepositoryUrl={data.sourceRepositoryUrl} />
  ),
});
