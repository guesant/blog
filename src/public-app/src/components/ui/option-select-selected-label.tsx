import MuiTypography from '@mui/material/Typography';
import type { SelectOption } from './option-select';

type OptionSelectSelectedLabelProps = {
  option: SelectOption | undefined;
  value: string;
};

export function OptionSelectSelectedLabel(props: OptionSelectSelectedLabelProps) {
  return (
    <MuiTypography
      component="span"
      sx={{
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {props.option?.label ?? props.value}
    </MuiTypography>
  );
}
