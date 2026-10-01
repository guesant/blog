import type { ReactNode } from 'react';
import { ProtectedEmailDialogInlineStateFrame } from './protected-email-dialog-inline-state-frame';
import { ProtectedEmailDialogStackedStateFrame } from './protected-email-dialog-stacked-state-frame';

type ProtectedEmailDialogStateLayout = 'stacked' | 'inline';

type ProtectedEmailDialogStateFrameProps = {
  layout: ProtectedEmailDialogStateLayout;
  children: ReactNode;
};

export function ProtectedEmailDialogStateFrame(props: ProtectedEmailDialogStateFrameProps) {
  if (props.layout === 'inline') {
    return <ProtectedEmailDialogInlineStateFrame children={props.children} />;
  }

  return <ProtectedEmailDialogStackedStateFrame children={props.children} />;
}
