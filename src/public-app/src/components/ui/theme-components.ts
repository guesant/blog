import { themeComponentsBase } from './theme-components-base';
import { themeComponentsControls } from './theme-components-controls';
import { themeComponentsOverlays } from './theme-components-overlays';

export const themeComponents = {
  ...themeComponentsBase,
  ...themeComponentsControls,
  ...themeComponentsOverlays,
};
