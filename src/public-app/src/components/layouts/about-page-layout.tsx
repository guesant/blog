import type { ReactNode } from 'react';
import { AboutPageLayoutFrame } from '../ui/semantic/AboutPageLayoutFrame';

type AboutPageLayoutProps = { children: ReactNode };

export function AboutPageLayout(props: AboutPageLayoutProps) {
  return <AboutPageLayoutFrame>{props.children}</AboutPageLayoutFrame>;
}
