import { ListingPaginationButton } from '../../ui/semantic/ListingPaginationButton';

type ListingPaginationNextButtonProps = {
  disabled: boolean;
  label: string;
  onClick: () => void;
};

export function ListingPaginationNextButton(props: ListingPaginationNextButtonProps) {
  return (
    <ListingPaginationButton
      type="button"
      variant="outlined"
      disabled={props.disabled}
      aria-label={props.label}
      onClick={props.onClick}
    >
      {'>'}
    </ListingPaginationButton>
  );
}
