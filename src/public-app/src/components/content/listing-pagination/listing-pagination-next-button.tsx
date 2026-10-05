import { ListingPaginationButton } from '../../ui/semantic/ListingPaginationButton';

type ListingPaginationNextButtonProps = {
  label: string;
  onClick: () => void;
};

export function ListingPaginationNextButton(props: ListingPaginationNextButtonProps) {
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
