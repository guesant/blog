import type { ReactNode } from 'react';
import { Box } from '../ui';
import { PageTransition } from '../primitives/page-transition';

type SiteMainContentProps = { children: ReactNode };

export function SiteMainContent(props: SiteMainContentProps) {
  return (
    <Box id="main-content" tabIndex={-1} visualVariant="siteMainContent">
      <PageTransition>{props.children}</PageTransition>
    </Box>
  );
}
