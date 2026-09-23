import { ContactPageContent } from '../../sections/contact';
import { createRouteRenderer } from './create-route-renderer';

export const ContactRouteRenderer = createRouteRenderer({
  kind: 'contact',
  render: (data) => <ContactPageContent page={data.page} site={data.site} />,
});
