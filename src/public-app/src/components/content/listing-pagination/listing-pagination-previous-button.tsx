import { ListingPaginationButton } from '../../ui/semantic/ListingPaginationButton';

type ListingPaginationPreviousButtonProps = {
  label: string;
  disabled: boolean;
  onClick: () => void;
};

export function ListingPaginationPreviousButton(props: ListingPaginationPreviousButtonProps) {
  return (
    <ListingPaginationButton
      type="button"
      variant="outlined"
      aria-label={props.label}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.label}
    </ListingPaginationButton>
  );
}
