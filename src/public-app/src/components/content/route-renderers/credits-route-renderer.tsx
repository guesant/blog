import { CreditsPageContent } from '../../sections/credits';
import type { RouteRendererProps } from './route-renderers.types';

type CreditsRouteRendererProps = RouteRendererProps;

export function CreditsRouteRenderer(props: CreditsRouteRendererProps) {
  if (props.data.kind !== 'credits') {
    return null;
  }

  return <CreditsPageContent content={props.data.content} />;
}
