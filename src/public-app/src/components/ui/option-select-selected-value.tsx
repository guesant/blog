import MuiBox from '@mui/material/Box';
import { OptionSelectSelectedIcon } from './option-select-selected-icon';
import { OptionSelectSelectedLabel } from './option-select-selected-label';
import type { SelectOption } from './option-select';

type OptionSelectSelectedValueProps = {
  options: readonly SelectOption[];
  value: string;
};

export function OptionSelectSelectedValue(props: OptionSelectSelectedValueProps) {
  const option = props.options.find((item) => item.value === props.value);

  return (
    <MuiBox
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'nowrap',
        minWidth: 0,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <OptionSelectSelectedIcon option={option} />
      <OptionSelectSelectedLabel option={option} value={props.value} />
    </MuiBox>
  );
}
