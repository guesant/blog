import type { ReactNode } from 'react';
import { Box } from '../ui';
import { PageTransition } from '../primitives/page-transition';
import { RouteViewStateProvider } from '../../data/queries/route-view-state-provider';

type SiteMainContentProps = { children: ReactNode };

export function SiteMainContent(props: SiteMainContentProps) {
  return (
    <Box id="main-content" tabIndex={-1} visualVariant="siteMainContent">
      <RouteViewStateProvider>
        <PageTransition children={props.children} />
      </RouteViewStateProvider>
    </Box>
  );
}
