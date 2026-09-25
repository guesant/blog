export const themeComponentsControls = {
  MuiButton: {
    defaultProps: { disableElevation: true, variant: 'outlined' as const },
    styleOverrides: {
      root: {
        borderRadius: 0,
        fontFamily: 'var(--site-font-action)',
        textAlign: 'left' as const,
        padding: 'var(--site-action-py) var(--site-action-px)',
        minHeight: 'var(--site-control-h)',
        height: 'auto',
        whiteSpace: 'normal',
        minWidth: 0,
        '& .MuiButton-label': {
          display: 'block',
          minWidth: 0,
          flex: '1 1 auto',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'inherit',
        },
        '& .MuiButton-startIcon': {
          marginLeft: 0,
          marginRight: 'var(--site-space-2)',
        },
        '& .MuiButton-endIcon': {
          marginRight: 0,
          marginLeft: 'var(--site-space-2)',
        },
        "& .MuiButton-endIcon:has([data-site-icon='external'])": {
          marginLeft: 'auto',
        },
      },
      sizeSmall: {
        padding: 'var(--site-action-py) var(--site-action-px)',
        minHeight: 'var(--site-control-h-sm)',
      },
      sizeLarge: {
        padding: 'var(--site-action-py) var(--site-action-px)',
        minHeight: 'var(--site-control-h-lg)',
      },
      text: { padding: 'var(--site-action-py) var(--site-action-px)' },
    },
  },
  MuiLink: {
    defaultProps: { color: 'primary' },
    styleOverrides: {
      root: {
        textUnderlineOffset: 'var(--site-space-1)',
        '&[data-site-external-link="true"]': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--site-space-2)',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        padding: 'var(--site-action-py) var(--site-action-px)',
        fontSize: 'var(--site-text-sm)',
        fontWeight: 'var(--site-weight-medium)',
        lineHeight: 'var(--site-leading-normal)',
      },
      label: { padding: 0 },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        height: 'var(--site-control-h)',
        minHeight: 'var(--site-control-h)',
        borderRadius: 0,
        backgroundColor: 'var(--site-surface)',
        fontFamily: 'var(--site-font-action)',
        fontSize: 'var(--site-text-form)',
        lineHeight: 'var(--site-leading-normal)',
        '& .MuiOutlinedInput-input': {
          fontFamily: 'var(--site-font-action)',
          padding: 'var(--site-inset-control)',
        },
        '&.MuiInputBase-sizeSmall': {
          height: 'var(--site-control-h-sm)',
          minHeight: 'var(--site-control-h-sm)',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--site-border-strong)',
          borderWidth: 'var(--site-border-width)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--site-primary)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--site-primary)',
          borderWidth: 'var(--site-border-width)',
        },
      },
    },
  },
};
