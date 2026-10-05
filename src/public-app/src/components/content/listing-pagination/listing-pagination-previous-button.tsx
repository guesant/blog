import { ListingPaginationButton } from '../../ui/semantic/ListingPaginationButton';

type ListingPaginationPreviousButtonProps = {
  label: string;
  onClick: () => void;
};

export function ListingPaginationPreviousButton(props: ListingPaginationPreviousButtonProps) {
  return (
    <ListingPaginationButton
      type="button"
      variant="outlined"
      aria-label={props.label}
      onClick={props.onClick}
    >
      {props.label}
    </ListingPaginationButton>
  );
}
