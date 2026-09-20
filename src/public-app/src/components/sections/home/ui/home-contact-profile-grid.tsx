import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeContactProfileGridProps = {
  children: ReactNode;
};

export function HomeContactProfileGrid(props: HomeContactProfileGridProps) {
  return <Box sx={{ display: 'contents' }}>{props.children}</Box>;
}
