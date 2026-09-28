import type { ReactNode } from 'react';
import { Box } from '../box';

type ProtectedEmailDialogIconFrameProps = {
  working: boolean;
  children: ReactNode;
};

const iconStyles = { display: 'inline-flex' };

const workingIconStyles = {
  ...iconStyles,
  animation: 'protected-email-pulse 1.6s ease-in-out infinite',
  '@keyframes protected-email-pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.45 },
  },
};

export function ProtectedEmailDialogIconFrame(props: ProtectedEmailDialogIconFrameProps) {
  return <Box sx={props.working ? workingIconStyles : iconStyles}>{props.children}</Box>;
}
