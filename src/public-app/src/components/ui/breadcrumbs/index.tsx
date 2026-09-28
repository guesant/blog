import type { ComponentProps } from 'react';
import BaseBreadcrumbs from '@mui/material/Breadcrumbs';

export type BreadcrumbsProps = ComponentProps<typeof BaseBreadcrumbs>;

export function Breadcrumbs(props: BreadcrumbsProps) {
  return <BaseBreadcrumbs {...props} />;
}
