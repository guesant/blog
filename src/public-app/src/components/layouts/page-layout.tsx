import { Box } from '../ui';
import type { ReactNode } from 'react';

type PageLayoutProps = {
  children: ReactNode;
  visualVariant?: string;
};

export function PageLayout(props: PageLayoutProps) {
  const { children } = props;

  return (
    <Box component="section" visualVariant={props.visualVariant ?? 'pageLayout'}>
      {children}
    </Box>
  );
}
