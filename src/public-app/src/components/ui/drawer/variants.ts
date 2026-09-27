import type { SxProps, Theme } from '@mui/material/styles';

export const drawerVariants: Record<string, SxProps<Theme>> = {
  mobileSidebar: { width: 'min(var(--site-offcanvas-w), var(--site-offcanvas-max))' },
};
