import { HomeSection } from '../../sections/home';
import { createRouteRenderer } from './create-route-renderer';

export const HomeRouteRenderer = createRouteRenderer({
  kind: 'home',
  render: (data) => (
    <HomeSection
      content={data.content}
      feedItems={data.feedItems}
      feedPagination={data.feedPagination}
      feedSearch={data.feedSearch}
    />
  ),
});
