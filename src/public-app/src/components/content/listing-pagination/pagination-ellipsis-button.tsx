import { Button } from '../../ui';
import type { PaginationPageButtonProps } from './types';

type PaginationEllipsisButtonProps = PaginationPageButtonProps;

export function PaginationEllipsisButton(props: PaginationEllipsisButtonProps) {
  return (
    <Button disabled aria-hidden="true" siteVariant="pagination" size="small">
      {props.value}
    </Button>
  );
}
