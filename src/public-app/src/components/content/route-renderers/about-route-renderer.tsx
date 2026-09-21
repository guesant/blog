import { AboutPageContent } from '../../sections/about';
import type { RouteRendererProps } from './route-renderers.types';

type AboutRouteRendererProps = RouteRendererProps;

export function AboutRouteRenderer(props: AboutRouteRendererProps) {
  if (props.data.kind !== 'about') {
    return null;
  }

  return <AboutPageContent page={props.data.page} profile={props.data.profile} />;
}
