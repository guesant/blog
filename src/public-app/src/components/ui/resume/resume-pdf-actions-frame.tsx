import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumePdfActionsFrameProps = { children: ReactNode };

export function ResumePdfActionsFrame(props: ResumePdfActionsFrameProps) {
  return <Box sx={{ display: 'flex', justifyContent: 'center' }}>{props.children}</Box>;
}
