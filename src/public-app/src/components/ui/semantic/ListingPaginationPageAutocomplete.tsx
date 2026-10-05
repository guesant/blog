import Autocomplete, { type AutocompleteProps } from '@mui/material/Autocomplete';
import { mergeSx } from '@/components/ui/sx';
import { TextField } from '@/components/ui/text-field';

export type ListingPaginationPageAutocompleteProps = Omit<
  AutocompleteProps<number, false, true, false>,
  'renderInput'
> & {
  inputLabel: string;
};

export function ListingPaginationPageAutocomplete(props: ListingPaginationPageAutocompleteProps) {
  const { inputLabel, ...autocompleteProps } = props;

  return (
    <Autocomplete
      {...autocompleteProps}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          slotProps={{
            ...params.slotProps,
            htmlInput: {
              ...params.slotProps.htmlInput,
              'aria-label': inputLabel,
              inputMode: 'numeric',
            },
          }}
        />
      )}
      sx={mergeSx(
        {
          width: 'var(--site-control-w-page)',
          '& .MuiInputBase-input': { textAlign: 'center' },
        },
        props.sx,
      )}
    />
  );
}
