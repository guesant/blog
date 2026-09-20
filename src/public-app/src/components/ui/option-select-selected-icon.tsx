import MuiListItemIcon from '@mui/material/ListItemIcon';
import type { SelectOption } from './option-select';

type OptionSelectSelectedIconProps = {
  option: SelectOption | undefined;
};

export function OptionSelectSelectedIcon(props: OptionSelectSelectedIconProps) {
  if (!props.option?.icon) {
    return null;
  }

  return (
    <MuiListItemIcon sx={{ flexShrink: 0, minWidth: 'var(--site-icon-box-md)' }}>
      {props.option.icon}
    </MuiListItemIcon>
  );
}
