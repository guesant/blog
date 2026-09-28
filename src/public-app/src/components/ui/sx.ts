import type { SxProps, Theme } from '@mui/material/styles';

export function mergeSx(base: SxProps<Theme>, override?: SxProps<Theme>): SxProps<Theme> {
  if (override === undefined) return base;
  return [base, ...(Array.isArray(override) ? override : [override])] as SxProps<Theme>;
}
