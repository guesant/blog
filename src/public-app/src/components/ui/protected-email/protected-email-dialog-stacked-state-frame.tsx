import type { ReactNode } from 'react';
import { Box } from '../box';

type ProtectedEmailDialogStackedStateFrameProps = { children: ReactNode };

export function ProtectedEmailDialogStackedStateFrame(
  props: ProtectedEmailDialogStackedStateFrameProps,
) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--site-space-3)',
        alignItems: 'center',
      }}
    >
      {props.children}
    </Box>
  );
}
