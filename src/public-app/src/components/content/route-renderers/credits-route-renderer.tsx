import { CreditsPageContent } from '../../sections/credits';
import { createRouteRenderer } from './create-route-renderer';

export const CreditsRouteRenderer = createRouteRenderer({
  kind: 'credits',
  render: (data) => <CreditsPageContent content={data.content} />,
});
