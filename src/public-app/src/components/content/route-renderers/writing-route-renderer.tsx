import { WritingSection } from '../../sections/writing';
import type { RouteRendererProps } from './route-renderers.types';

type WritingRouteRendererProps = RouteRendererProps;

export function WritingRouteRenderer(props: WritingRouteRendererProps) {
  if (props.data.kind !== 'writing') {
    return null;
  }

  return (
    <WritingSection
      writings={props.data.writings}
      findings={props.data.findings}
      collections={props.data.collections}
      copy={props.data.page}
      contentMeta={props.data.pagination}
    />
  );
}
