import { ListingPaginationButton } from '../../ui/semantic/ListingPaginationButton';

type ListingPaginationPreviousButtonProps = {
  disabled: boolean;
  label: string;
  onClick: () => void;
};

export function ListingPaginationPreviousButton(props: ListingPaginationPreviousButtonProps) {
  return (
    <ListingPaginationButton
      type="button"
      variant="outlined"
      disabled={props.disabled}
      aria-label={props.label}
      onClick={props.onClick}
    >
      {'<'}
    </ListingPaginationButton>
  );
}
