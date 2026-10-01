import type { ReactNode } from 'react';
import { Box } from '../box';

type ProtectedEmailDialogWorkingIconFrameProps = { children: ReactNode };

export function ProtectedEmailDialogWorkingIconFrame(
  props: ProtectedEmailDialogWorkingIconFrameProps,
) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        animation: 'protected-email-pulse 1.6s ease-in-out infinite',
        '@keyframes protected-email-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.45 },
        },
      }}
    >
      {props.children}
    </Box>
  );
}
