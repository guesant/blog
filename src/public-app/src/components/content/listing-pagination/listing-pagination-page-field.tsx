import { Typography } from '../../ui/typography';
import {
  ListingPaginationPageAutocomplete,
  type ListingPaginationPageAutocompleteProps,
} from '../../ui/semantic/ListingPaginationPageAutocomplete';

type ListingPaginationPageFieldProps = {
  value: number;
  label: string;
  pageCount: number;
  pageOfLabel: string;
  onChange: (page: number) => void;
};

export function ListingPaginationPageField(props: ListingPaginationPageFieldProps) {
  const options = Array.from({ length: props.pageCount }, (_, index) => index + 1);

  const handleChange: NonNullable<ListingPaginationPageAutocompleteProps['onChange']> = (
    _event,
    value,
  ) => {
    if (value !== null) {
      props.onChange(value);
    }
  };

  return (
    <>
      <ListingPaginationPageAutocomplete
        disableClearable
        disablePortal
        getOptionLabel={(option) => String(option)}
        inputLabel={props.label}
        isOptionEqualToValue={(option, value) => option === value}
        options={options}
        value={props.value}
        onChange={handleChange}
      />
      <Typography component="span" variant="body2" color="text.secondary" whiteSpace="nowrap">
        {props.pageOfLabel} {props.pageCount}
      </Typography>
    </>
  );
}
