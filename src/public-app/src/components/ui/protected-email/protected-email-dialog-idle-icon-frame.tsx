import type { ReactNode } from 'react';
import { Box } from '../box';

type ProtectedEmailDialogIdleIconFrameProps = { children: ReactNode };

export function ProtectedEmailDialogIdleIconFrame(props: ProtectedEmailDialogIdleIconFrameProps) {
  return <Box sx={{ display: 'inline-flex' }}>{props.children}</Box>;
}
