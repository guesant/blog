import MuiStack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ComponentProps, ElementType } from 'react';
import { normalizeSx } from './sx';

type LayoutValue = string | number | Record<string, string | number>;
type LayoutStackProps = Omit<ComponentProps<typeof MuiStack>, 'sx'> & {
  component?: ElementType;
  gap?: LayoutValue;
  flexWrap?: LayoutValue;
  alignItems?: LayoutValue;
  justifyContent?: LayoutValue;
  sx?: SxProps<Theme>;
};

export function LayoutStack(layoutStackProps: LayoutStackProps) {
  const { gap, flexWrap, alignItems, justifyContent, sx, ...stackProps } = layoutStackProps;
  const base = {
    ...(gap !== undefined ? { gap } : {}),
    ...(flexWrap !== undefined ? { flexWrap } : {}),
    ...(alignItems !== undefined ? { alignItems } : {}),
    ...(justifyContent !== undefined ? { justifyContent } : {}),
  };
  const styles: SxProps<Theme> = [base, ...normalizeSx(sx)];
  return <MuiStack {...stackProps} sx={styles} />;
}
