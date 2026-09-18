import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

type PageLayoutProps = { children: ReactNode };

export function PageLayout(props: PageLayoutProps) {
  const { children } = props;
  return (
    <Box component="section" sx={{ width: '100%', py: { xs: 8, md: 10 } }}>
      {children}
    </Box>
  );
}
