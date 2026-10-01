import { CollectionDetailPage } from '../../sections/collection-detail';
import { createRouteRenderer } from './create-route-renderer';

export const CollectionDetailRouteRenderer = createRouteRenderer({
  kind: 'collection-detail',
  render: (data) => <CollectionDetailPage collection={data.collection} />,
});
