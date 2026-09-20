import type { ReactNode } from 'react';
import { Button } from '../../ui';

type ListingPaginationBoundaryButtonProps = {
  label: string;
  disabled: boolean;
  icon: ReactNode;
  onClick: () => void;
};

export function ListingPaginationBoundaryButton(props: ListingPaginationBoundaryButtonProps) {
  return (
    <Button
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.label}
      title={props.label}
      siteVariant="pagination"
      size="small"
    >
      {props.icon}
    </Button>
  );
}
