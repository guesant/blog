import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarPreferencesFrameProps = { children: ReactNode };

export function SidebarPreferencesFrame(props: SidebarPreferencesFrameProps) {
  return <Box>{props.children}</Box>;
}
