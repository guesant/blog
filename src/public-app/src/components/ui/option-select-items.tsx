import MuiListItemIcon from '@mui/material/ListItemIcon';
import MuiListItemText from '@mui/material/ListItemText';
import MuiMenuItem from '@mui/material/MenuItem';
import type { ReactNode } from 'react';
import { ConditionalContent } from '../primitives/conditional-content';
import type { SelectOption } from './option-select';

type OptionSelectItemsProps = {
  options: readonly SelectOption[];
};

export function OptionSelectItems(props: OptionSelectItemsProps) {
  const items: ReactNode[] = [];

  for (const option of props.options) {
    const content: ReactNode[] = [];

    content.push(
      <ConditionalContent
        condition={Boolean(option.icon)}
        content={
          <MuiListItemIcon
            key="icon"
            sx={{ minWidth: 'var(--site-icon-box-md)' }}
            children={option.icon}
          />
        }
      />,
    );
    content.push(<MuiListItemText key="label" primary={option.label} />);
    items.push(
      <MuiMenuItem key={option.value} value={option.value} disabled={option.disabled}>
        {content}
      </MuiMenuItem>,
    );
  }

  return items;
}
