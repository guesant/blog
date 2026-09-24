import type { SxProps, Theme } from '@mui/material/styles';

export const paginationVariants: Record<string, SxProps<Theme>> = {
  listingPagination: {
    mt: 'var(--site-space-6)',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '100%',
    '& .MuiPagination-ul': {
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' },
      justifyContent: 'center',
      gap: 0,
      width: { xs: '100%', sm: 'auto' },
    },
    '& .MuiPaginationItem-root': {
      margin: 0,
      width: { xs: '100%', sm: 'auto' },
      minWidth: 'var(--site-control-h-sm)',
      height: 'var(--site-control-h-sm)',
      borderRadius: 0,
      borderColor: 'var(--site-primary)',
      color: 'var(--site-primary)',
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    '& .MuiPaginationItem-root + .MuiPaginationItem-root': {
      marginLeft: { xs: 0, sm: 'calc(var(--site-border-width) * -1)' },
      marginTop: { xs: 'calc(var(--site-border-width) * -1)', sm: 0 },
    },
    '& .MuiPaginationItem-firstLast, & .MuiPaginationItem-previousNext': {
      backgroundColor: 'var(--site-accent-bg)',
    },
    '& .MuiPaginationItem-root.Mui-selected': {
      color: 'var(--site-primary-contrast)',
      borderColor: 'var(--site-primary)',
      backgroundColor: 'var(--site-primary)',
      zIndex: 2,
    },
    '& .MuiPaginationItem-root.Mui-disabled': {
      color: 'var(--site-text-secondary)',
      borderColor: 'var(--site-border)',
      backgroundColor: 'var(--site-surface-muted)',
    },
    '& .MuiPaginationItem-root:hover': {
      color: 'var(--site-primary-hover)',
      borderColor: 'var(--site-primary-hover)',
      backgroundColor: 'var(--site-surface-hover)',
    },
  },
};
