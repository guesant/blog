export const themeComponentsNavigation = {
  MuiCssBaseline: {
    styleOverrides: {
      '[data-navigation-sidebar]': {
        position: 'relative',
        zIndex: 'var(--site-z-navigation-sidebar)',
      },
      '.navigation-sidebar-drawer': {
        zIndex: 'var(--site-z-navigation-sidebar)',
      },
      'html[data-navigation-state="loading"] [data-navigation-sidebar], html[data-navigation-state="loading"] .navigation-sidebar-drawer':
        {
          pointerEvents: 'none',
        },
    },
  },
};
