import type { ReactNode } from 'react';
import { Box } from '../box';

type ProtectedEmailDialogLiveRegionFrameProps = { children: ReactNode };

export function ProtectedEmailDialogLiveRegionFrame(
  props: ProtectedEmailDialogLiveRegionFrameProps,
) {
  return (
    <Box aria-live="polite" sx={{ display: 'flex', justifyContent: 'center' }}>
      {props.children}
    </Box>
  );
}
