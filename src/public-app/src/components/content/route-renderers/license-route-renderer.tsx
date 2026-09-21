import { LicensePageContent } from '../../sections/license';
import type { RouteRendererProps } from './route-renderers.types';

type LicenseRouteRendererProps = RouteRendererProps;

export function LicenseRouteRenderer(props: LicenseRouteRendererProps) {
  if (props.data.kind !== 'license') {
    return null;
  }

  return (
    <LicensePageContent
      page={props.data.page}
      emailChallenge={props.data.site.contact.emailChallenge}
    />
  );
}
