import { SnippetDetailPageContent } from '../../sections/snippets';
import { createRouteRenderer } from './create-route-renderer';

export const SnippetDetailRouteRenderer = createRouteRenderer({
  kind: 'snippet-detail',
  render: (data) => <SnippetDetailPageContent snippet={data.snippet} />,
});
