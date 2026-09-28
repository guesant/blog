import type { ReactNode } from 'react';
import { Box } from '../box';

type CaseFactFrameProps = { children: ReactNode };

export function CaseFactFrame(props: CaseFactFrameProps) {
  return <Box>{props.children}</Box>;
}
