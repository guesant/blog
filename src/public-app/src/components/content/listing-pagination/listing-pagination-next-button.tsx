import { ListingPaginationButton } from '../../ui/semantic/ListingPaginationButton';

type ListingPaginationNextButtonProps = {
  label: string;
  disabled: boolean;
  onClick: () => void;
};

export function ListingPaginationNextButton(props: ListingPaginationNextButtonProps) {
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
