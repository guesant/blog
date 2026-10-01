import type { PageHeaderFrameProps } from './index';
import { PageHeaderFrameContent } from './page-header-frame-content';

type PageHeaderShowcaseFrameProps = Omit<PageHeaderFrameProps, 'variant'>;

export function PageHeaderShowcaseFrame(props: PageHeaderShowcaseFrameProps) {
  return <PageHeaderFrameContent {...props} maxWidth="var(--site-content-max)" />;
}
