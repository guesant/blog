export const interactiveSelector = [
  'a[href]',
  'button:not([disabled])',
  '[role="button"]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
  '[data-cursor-interactive]',
].join(',');

export const nativeCursorSelector = [
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[data-native-cursor]',
].join(',');

export const devOverlaySelector = '[data-vite-devtools-overlay]';
