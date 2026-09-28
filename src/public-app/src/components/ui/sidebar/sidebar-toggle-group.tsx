import type { ReactNode } from 'react';
import type { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import { ToggleButtonGroup } from '../toggle-button-group';

type SidebarToggleGroupProps = Omit<ToggleButtonGroupProps, 'sx'> & {
  children: ReactNode;
};

const styles = {
  width: '100%',
  '& .MuiToggleButton-root': { flex: 1, minWidth: 0 },
};

export function SidebarToggleGroup(props: SidebarToggleGroupProps) {
  return <ToggleButtonGroup {...props} sx={styles} />;
}
