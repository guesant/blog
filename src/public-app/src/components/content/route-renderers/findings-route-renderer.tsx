import { FindingsSection } from '../../sections/findings';
import { createRouteRenderer } from './create-route-renderer';

export const FindingsRouteRenderer = createRouteRenderer({
  kind: 'findings',
  render: (data) => (
    <FindingsSection copy={data.page} initialData={data.initialData} {...data.request} />
  ),
});
