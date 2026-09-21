import { CaseDetailContent } from '../../sections/case-detail';
import type { RouteRendererProps } from './route-renderers.types';

type CaseDetailRouteRendererProps = RouteRendererProps;

export function CaseDetailRouteRenderer(props: CaseDetailRouteRendererProps) {
  if (props.data.kind !== 'case-detail') {
    return null;
  }

  return <CaseDetailContent item={props.data.item} />;
}
