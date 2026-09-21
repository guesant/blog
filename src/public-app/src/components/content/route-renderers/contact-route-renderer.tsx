import { ContactPageContent } from '../../sections/contact';
import type { RouteRendererProps } from './route-renderers.types';

type ContactRouteRendererProps = RouteRendererProps;

export function ContactRouteRenderer(props: ContactRouteRendererProps) {
  if (props.data.kind !== 'contact') {
    return null;
  }

  return <ContactPageContent page={props.data.page} site={props.data.site} />;
}
