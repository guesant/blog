import type { ReactNode } from 'react';
import { AboutPageLayout } from './about-page-layout';
import { StandardPageLayout } from './standard-page-layout';

type PageLayoutProps = {
  children: ReactNode;
  about?: boolean;
};

export function PageLayout(props: PageLayoutProps) {
  if (props.about) {
    return <AboutPageLayout children={props.children} />;
  }

  return <StandardPageLayout children={props.children} />;
}
