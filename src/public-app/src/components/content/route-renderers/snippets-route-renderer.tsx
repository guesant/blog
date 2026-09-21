import { SnippetsPageContent } from '../../sections/snippets';
import type { RouteRendererProps } from './route-renderers.types';

type SnippetsRouteRendererProps = RouteRendererProps;

export function SnippetsRouteRenderer(props: SnippetsRouteRendererProps) {
  if (props.data.kind !== 'snippets') {
    return null;
  }

  return <SnippetsPageContent snippets={props.data.snippets} pagination={props.data.pagination} />;
}
