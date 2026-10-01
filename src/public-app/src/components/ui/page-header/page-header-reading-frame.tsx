import type { PageHeaderFrameProps } from './index';
import { PageHeaderFrameContent } from './page-header-frame-content';

type PageHeaderReadingFrameProps = Omit<PageHeaderFrameProps, 'variant'>;

export function PageHeaderReadingFrame(props: PageHeaderReadingFrameProps) {
  return <PageHeaderFrameContent {...props} maxWidth="var(--site-page-header-max)" />;
}
