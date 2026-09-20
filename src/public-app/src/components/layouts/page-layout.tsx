import { Box } from '../ui';
import type { ReactNode } from 'react';

type PageLayoutProps = { children: ReactNode };

export function PageLayout(props: PageLayoutProps) {
  const { children } = props;

  return (
    <Box component="section" visualVariant="pageLayout">
      {children}
    </Box>
  );
}
