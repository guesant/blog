import { TipoDetailContent } from '../../sections/finding-type';
import { createRouteRenderer } from './create-route-renderer';

export const FindingTypeRouteRenderer = createRouteRenderer({
  kind: 'finding-type',
  render: (data) => (
    <TipoDetailContent tipo={data.type} references={data.references} pagination={data.pagination} />
  ),
});
