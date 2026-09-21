import { CasesPageContent } from '../../sections/cases';
import type { RouteRendererProps } from './route-renderers.types';

type CasesRouteRendererProps = RouteRendererProps;

export function CasesRouteRenderer(props: CasesRouteRendererProps) {
  if (props.data.kind !== 'cases') {
    return null;
  }

  return (
    <CasesPageContent
      page={props.data.page}
      items={props.data.items}
      pagination={props.data.pagination}
    />
  );
}
