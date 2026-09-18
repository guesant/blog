'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { PageLayout } from '../../components/layouts/page-layout';
import { StatusPage } from '../../components/pages/status-page';
import type { RouteErrorProps } from './route-params';

export default function RouteError(props: RouteErrorProps) {
  const { error, reset } = props;
  void error;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 5 } }}>
        <PageLayout>
          <StatusPage kind="error" reset={reset} />
        </PageLayout>
      </Container>
    </Box>
  );
}
