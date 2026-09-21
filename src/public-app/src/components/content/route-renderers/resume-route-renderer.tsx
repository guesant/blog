import { ResumePageContent } from '../../sections/resume';
import type { RouteRendererProps } from './route-renderers.types';

type ResumeRouteRendererProps = RouteRendererProps;

export function ResumeRouteRenderer(props: ResumeRouteRendererProps) {
  if (props.data.kind !== 'resume') {
    return null;
  }

  return <ResumePageContent content={props.data.content} pdfUrls={props.data.pdfUrls} />;
}
