import type { ComponentProps } from 'react';
import BasePagination from '@mui/material/Pagination';

export type PaginationProps = ComponentProps<typeof BasePagination>;

export function Pagination(props: PaginationProps) {
  return <BasePagination {...props} />;
}
