import { Button } from '../../ui';
import type { PaginationPageButtonProps } from './types';

type PaginationNumberButtonProps = PaginationPageButtonProps;

export function PaginationNumberButton(props: PaginationNumberButtonProps) {
  return (
    <Button
      onClick={() => props.goToPage(props.value as number)}
      aria-current={props.value === props.page ? 'page' : undefined}
      siteVariant="pagination"
      variant={props.value === props.page ? 'contained' : 'outlined'}
      size="small"
    >
      {props.value}
    </Button>
  );
}
