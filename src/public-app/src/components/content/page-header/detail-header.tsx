import type { DetailHeaderProps } from './types';
import { PageHeader } from './page-header';

export function DetailHeader(props: DetailHeaderProps) {
  return <PageHeader {...props} layout="detail" />;
}
