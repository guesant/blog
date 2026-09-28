import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeBreadcrumbsFrameProps = { children: ReactNode };

const breadcrumbsStyles = {
  display: 'flex',
  justifyContent: 'center',
  '@media print': { display: 'none' },
};

export function ResumeBreadcrumbsFrame(props: ResumeBreadcrumbsFrameProps) {
  return <Box sx={breadcrumbsStyles}>{props.children}</Box>;
}
