import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type ResumeBreadcrumbsProps = {
  children: ReactNode;
};

export function ResumeBreadcrumbs(props: ResumeBreadcrumbsProps) {
  return <Box visualVariant="resumeBreadcrumbs">{props.children}</Box>;
}
