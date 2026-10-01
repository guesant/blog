import type { ReactNode } from 'react';
import { PageLayoutFrame } from '../ui/semantic/PageLayoutFrame';

type StandardPageLayoutProps = { children: ReactNode };

export function StandardPageLayout(props: StandardPageLayoutProps) {
  return <PageLayoutFrame>{props.children}</PageLayoutFrame>;
}
