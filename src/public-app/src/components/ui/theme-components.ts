import { themeComponentsBase } from './theme-components-base';
import { themeComponentsControls } from './theme-components-controls';
import { themeComponentsNavigation } from './theme-components-navigation';
import { themeComponentsOverlays } from './theme-components-overlays';

export const themeComponents = {
  ...themeComponentsBase,
  ...themeComponentsControls,
  ...themeComponentsOverlays,
  MuiCssBaseline: {
    ...themeComponentsBase.MuiCssBaseline,
    styleOverrides: {
      ...themeComponentsBase.MuiCssBaseline.styleOverrides,
      ...themeComponentsNavigation.MuiCssBaseline.styleOverrides,
    },
  },
};
