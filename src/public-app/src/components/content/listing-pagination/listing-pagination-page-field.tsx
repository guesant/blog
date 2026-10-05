import type { ComponentProps } from 'react';
import { Typography } from '../../ui/typography';
import { ListingPaginationPageInput } from '../../ui/semantic/ListingPaginationPageInput';

type ListingPaginationPageFieldProps = {
  value: string;
  label: string;
  pageCount: number;
  pageOfLabel: string;
  onChange: ComponentProps<typeof ListingPaginationPageInput>['onChange'];
  onBlur: ComponentProps<typeof ListingPaginationPageInput>['onBlur'];
};

export function ListingPaginationPageField(props: ListingPaginationPageFieldProps) {
  return (
    <>
      <ListingPaginationPageInput
        size="small"
        type="number"
        value={props.value}
        aria-label={props.label}
        onChange={props.onChange}
        onBlur={props.onBlur}
        slotProps={{
          htmlInput: {
            min: 1,
            max: props.pageCount,
            inputMode: 'numeric',
          },
        }}
      />
      <Typography component="span" variant="body2" color="text.secondary" whiteSpace="nowrap">
        {props.pageOfLabel} {props.pageCount}
      </Typography>
    </>
  );
}
