import { SnippetDetailPageContent } from '../../sections/snippets';
import type { RouteRendererProps } from './route-renderers.types';

type SnippetDetailRouteRendererProps = RouteRendererProps;

export function SnippetDetailRouteRenderer(props: SnippetDetailRouteRendererProps) {
  if (props.data.kind !== 'snippet-detail') {
    return null;
  }

  return <SnippetDetailPageContent snippet={props.data.snippet} />;
}
