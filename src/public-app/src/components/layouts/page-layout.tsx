import { AboutPageLayoutFrame } from '../ui/semantic/AboutPageLayoutFrame';
import { PageLayoutFrame } from '../ui/semantic/PageLayoutFrame';
import type { ReactNode } from 'react';

type PageLayoutProps = {
  children: ReactNode;
  about?: boolean;
};

export function PageLayout(props: PageLayoutProps) {
  const Frame = props.about ? AboutPageLayoutFrame : PageLayoutFrame;

  return <Frame>{props.children}</Frame>;
}
