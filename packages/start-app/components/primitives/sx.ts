import type { SxProps, Theme } from '@mui/material/styles';

type SxArray = Extract<SxProps<Theme>, readonly unknown[]>;
type SxValue = Exclude<SxProps<Theme>, readonly unknown[]>;

export function normalizeSx(sx: SxProps<Theme> | undefined): SxArray {
  if (!sx) {
    return [];
  }
  return Array.isArray(sx) ? sx : [sx as SxValue];
}
