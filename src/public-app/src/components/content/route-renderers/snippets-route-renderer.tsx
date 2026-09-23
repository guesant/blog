import { SnippetsPageContent } from '../../sections/snippets';
import { createRouteRenderer } from './create-route-renderer';

export const SnippetsRouteRenderer = createRouteRenderer({
  kind: 'snippets',
  render: (data) => <SnippetsPageContent snippets={data.snippets} pagination={data.pagination} />,
});
