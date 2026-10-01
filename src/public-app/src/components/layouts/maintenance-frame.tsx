import type { ReactNode } from 'react';
import { MaintenancePageContainer } from '../ui/semantic/MaintenancePageContainer';
import { MaintenancePageSurfaceFrame } from '../ui/semantic/MaintenancePageSurfaceFrame';

type MaintenanceFrameProps = {
  children: ReactNode;
};

export function MaintenanceFrame(props: MaintenanceFrameProps) {
  return (
    <MaintenancePageSurfaceFrame component="main">
      <MaintenancePageContainer maxWidth="sm">{props.children}</MaintenancePageContainer>
    </MaintenancePageSurfaceFrame>
  );
}
