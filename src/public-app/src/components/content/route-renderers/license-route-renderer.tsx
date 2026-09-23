import { LicensePageContent } from '../../sections/license';
import { createRouteRenderer } from './create-route-renderer';

export const LicenseRouteRenderer = createRouteRenderer({
  kind: 'license',
  render: (data) => (
    <LicensePageContent page={data.page} emailChallenge={data.site.contact.emailChallenge} />
  ),
});
