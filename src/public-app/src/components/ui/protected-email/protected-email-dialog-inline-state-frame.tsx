import type { ReactNode } from 'react';
import { Box } from '../box';

type ProtectedEmailDialogInlineStateFrameProps = { children: ReactNode };

export function ProtectedEmailDialogInlineStateFrame(
  props: ProtectedEmailDialogInlineStateFrameProps,
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--site-space-3)' }}>
      {props.children}
    </Box>
  );
}
