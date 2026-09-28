import type { ReactNode } from 'react';
import { MaintenanceFrameContainer } from '../ui/semantic/MaintenanceFrameContainer';
import { MaintenanceFrameFrame } from '../ui/semantic/MaintenanceFrameFrame';

type MaintenanceFrameProps = {
  children: ReactNode;
};

export function MaintenanceFrame(props: MaintenanceFrameProps) {
  return (
    <MaintenanceFrameFrame component="main">
      <MaintenanceFrameContainer maxWidth="sm">{props.children}</MaintenanceFrameContainer>
    </MaintenanceFrameFrame>
  );
}
