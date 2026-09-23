import { LoadingPage } from '../../sections/loading';
import { createRouteRenderer } from './create-route-renderer';

const LoadingRouteRenderer = createRouteRenderer({
  kind: 'loading',
  render: () => <LoadingPage />,
});

export default LoadingRouteRenderer;
