import { ResumePageContent } from '../../sections/resume';
import { createRouteRenderer } from './create-route-renderer';

export const ResumeRouteRenderer = createRouteRenderer({
  kind: 'resume',
  render: (data) => <ResumePageContent content={data.content} pdfUrls={data.pdfUrls} />,
});
