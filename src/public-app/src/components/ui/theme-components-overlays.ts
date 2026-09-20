export const themeComponentsOverlays = {
  MuiSelect: {
    styleOverrides: {
      select: { borderRadius: 0 },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        fontFamily: 'var(--site-font-action)',
        fontSize: 'var(--site-text-xs)',
        lineHeight: 'var(--site-leading-normal)',
        letterSpacing: 'var(--site-letter-label)',
        '&.Mui-focused': { color: 'var(--site-primary)' },
      },
    },
  },
  MuiCard: {
    defaultProps: { elevation: 0, variant: 'outlined' as const },
    styleOverrides: {
      root: { borderColor: 'var(--site-border)', borderRadius: 0 },
    },
  },
  MuiPaper: {
    styleOverrides: { root: { backgroundImage: 'none', borderRadius: 0 } },
  },
  MuiAutocomplete: {
    styleOverrides: {
      paper: { borderRadius: 0 },
      listbox: { borderRadius: 0 },
      option: { borderRadius: 0 },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        marginTop: 'var(--site-space-2)',
        border: 'var(--site-border-width) solid var(--site-border)',
        borderRadius: 0,
        boxShadow: 'var(--site-shadow-popover)',
      },
      list: { padding: 'var(--site-space-1)' },
    },
  },
  MuiPopover: {
    styleOverrides: { paper: { borderRadius: 0 } },
  },
  MuiDialog: {
    styleOverrides: { paper: { borderRadius: 0 } },
  },
  MuiDrawer: {
    styleOverrides: { paper: { borderRadius: 0 } },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: 'var(--site-text-sm)',
        borderRadius: 0,
        padding: 'var(--site-inset-control)',
        minHeight: 'var(--site-control-h-sm)',
        lineHeight: 'var(--site-leading-normal)',
      },
    },
  },
  MuiListSubheader: {
    styleOverrides: {
      root: {
        fontSize: 'var(--site-text-xs)',
        lineHeight: 'var(--site-leading-normal)',
        letterSpacing: 'var(--site-letter-label)',
        fontWeight: 'var(--site-weight-semibold)',
        textTransform: 'uppercase',
        color: 'var(--site-text-secondary)',
        backgroundColor: 'transparent',
        padding: 'var(--site-space-2) var(--site-space-3) var(--site-space-1)',
      },
    },
  },
};
