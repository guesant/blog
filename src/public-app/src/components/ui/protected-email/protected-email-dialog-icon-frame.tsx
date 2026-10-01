import type { ReactNode } from 'react';
import { ProtectedEmailDialogIdleIconFrame } from './protected-email-dialog-idle-icon-frame';
import { ProtectedEmailDialogWorkingIconFrame } from './protected-email-dialog-working-icon-frame';

type ProtectedEmailDialogIconFrameProps = {
  working: boolean;
  children: ReactNode;
};

export function ProtectedEmailDialogIconFrame(props: ProtectedEmailDialogIconFrameProps) {
  if (props.working) {
    return <ProtectedEmailDialogWorkingIconFrame children={props.children} />;
  }

  return <ProtectedEmailDialogIdleIconFrame children={props.children} />;
}
