import type { SxProps, Theme } from '@mui/material/styles';

export function createOptionSelectSx(sx: SxProps<Theme> | undefined, hasEndAdornment: boolean) {
  return {
    ...sx,
    '&.MuiOutlinedInput-root': {
      flexWrap: 'nowrap',
    },
    '& .MuiInputAdornment-root': {
      flexShrink: 0,
    },
    '& .MuiInputAdornment-positionEnd': {
      marginRight: 'var(--site-space-3)',
    },
    '& .MuiSelect-select': {
      minWidth: 0,
      overflow: 'hidden',
      paddingRight: hasEndAdornment
        ? 'calc(var(--site-control-inset-clear) + var(--site-space-3))'
        : undefined,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& .MuiSelect-icon': {
      right: 'var(--site-space-1)',
    },
  } satisfies SxProps<Theme>;
}
