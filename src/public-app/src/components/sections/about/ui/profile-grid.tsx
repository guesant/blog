import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type AboutProfileGridProps = {
  children: ReactNode;
};

export function AboutProfileGrid(props: AboutProfileGridProps) {
  return <Box visualVariant="pageSplit">{props.children}</Box>;
}
