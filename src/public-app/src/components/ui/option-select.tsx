import MuiSelect, { type SelectChangeEvent, type SelectProps } from '@mui/material/Select';
import type { ReactNode } from 'react';
import { renderOptionSelectValue } from './render-option-select-value';
import { OptionSelectItems } from './option-select-items';
import { createOptionSelectSx } from './create-option-select-sx';

export type SelectOption = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SelectOptionChangeEvent = SelectChangeEvent<string>;

type OptionSelectProps = Omit<SelectProps<string>, 'children'> & {
  options: readonly SelectOption[];
};

export function OptionSelect(props: OptionSelectProps) {
  const { options, ...selectProps } = props;

  return (
    <MuiSelect
      {...selectProps}
      displayEmpty
      renderValue={renderOptionSelectValue.bind(null, options)}
      sx={createOptionSelectSx(selectProps.sx, Boolean(selectProps.endAdornment))}
    >
      <OptionSelectItems options={options} />
    </MuiSelect>
  );
}
