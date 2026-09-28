import type { ReactNode } from 'react';
import { PageTransition } from '../primitives/page-transition';
import { RouteViewStateProvider } from '../../data/queries/route-view-state-provider';
import { SiteMainContentFrame } from '../ui/semantic/SiteMainContentFrame';

type SiteMainContentProps = { children: ReactNode };

export function SiteMainContent(props: SiteMainContentProps) {
  return (
    <SiteMainContentFrame id="main-content" tabIndex={-1}>
      <RouteViewStateProvider>
        <PageTransition children={props.children} />
      </RouteViewStateProvider>
    </SiteMainContentFrame>
  );
}
