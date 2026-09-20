'use client';

import { PaginationEllipsisButton } from './pagination-ellipsis-button';
import { PaginationNumberButton } from './pagination-number-button';
import type { PaginationPageButtonProps } from './types';

export function PaginationPageButton(props: PaginationPageButtonProps) {
  if (props.value === 'ellipsis') {
    return <PaginationEllipsisButton {...props} />;
  }
  return <PaginationNumberButton {...props} />;
}
