import { AboutPageContent } from '../../sections/about';
import { createRouteRenderer } from './create-route-renderer';

export const AboutRouteRenderer = createRouteRenderer({
  kind: 'about',
  render: (data) => <AboutPageContent page={data.page} profile={data.profile} />,
});
