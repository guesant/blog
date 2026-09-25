import type { SxProps, Theme } from '@mui/material/styles';

export const breadcrumbsVariants: Record<string, SxProps<Theme>> = {
  breadcrumbs: {
    margin: 0,
    fontSize: 'var(--site-text-sm)',
    color: 'text.secondary',
    '& .MuiBreadcrumbs-li': { display: 'flex', alignItems: 'center' },
    '& .MuiBreadcrumbs-separator': { mx: 0.75, color: 'text.disabled' },
  },
};
