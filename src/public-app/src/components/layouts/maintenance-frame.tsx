import type { ReactNode } from 'react';
import { Box, Container } from '../ui';

type MaintenanceFrameProps = {
  children: ReactNode;
};

export function MaintenanceFrame(props: MaintenanceFrameProps) {
  return (
    <Box component="main" visualVariant="maintenanceFrame">
      <Container maxWidth="sm" visualVariant="maintenanceFrame">
        {props.children}
      </Container>
    </Box>
  );
}
