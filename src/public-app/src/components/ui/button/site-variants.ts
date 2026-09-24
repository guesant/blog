import type { SxProps, Theme } from '@mui/material/styles';

export type SiteButtonVariant =
  | 'default'
  | 'sidebar'
  | 'action'
  | 'action-icon'
  | 'availability'
  | 'exploration'
  | 'contact'
  | 'breadcrumb'
  | 'pagination'
  | 'compact-icon';

const actionButtonSx: SxProps<Theme> = {
  color: 'var(--site-primary)',
  borderColor: 'var(--site-primary)',
  '&:hover': {
    color: 'var(--site-primary-hover)',
    borderColor: 'var(--site-primary-hover)',
    backgroundColor: 'var(--site-surface-hover)',
  },
};

export const siteButtonVariants: Record<SiteButtonVariant, SxProps<Theme>> = {
  default: {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textTransform: 'none',
  },
  sidebar: {
    width: '100%',
    minWidth: 0,
    justifyContent: 'flex-start',
    padding: 'var(--site-action-py) var(--site-space-3)',
    color: 'var(--site-primary-muted)',
    borderColor: 'var(--site-primary-muted)',
    textAlign: 'left',
    '&:hover': {
      color: 'var(--site-primary)',
      borderColor: 'var(--site-primary)',
      backgroundColor: 'var(--site-surface-hover)',
    },
  },
  action: actionButtonSx,
  'action-icon': {
    ...actionButtonSx,
    width: 'var(--site-control-h-sm)',
    minWidth: 'var(--site-control-h-sm)',
    padding: 'var(--site-space-1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
  },
  availability: {
    color: 'var(--site-success)',
    borderColor: 'var(--site-success)',
    padding: 'var(--site-action-py) var(--site-action-px)',
    whiteSpace: 'nowrap',
    fontSize: {
      xs: 'var(--site-text-xs)',
      sm: 'var(--site-text-sm)',
    },
    textTransform: 'none',
    '&:hover': {
      color: 'var(--site-success)',
      borderColor: 'var(--site-success)',
      backgroundColor: 'var(--site-success-bg)',
    },
  },
  exploration: {
    justifyContent: 'flex-start',
    color: 'var(--site-text-primary)',
    borderColor: 'var(--site-border)',
    backgroundColor: 'transparent',
    '&:hover': {
      color: 'var(--site-primary)',
      borderColor: 'var(--site-primary)',
      backgroundColor: 'var(--site-surface-hover)',
    },
  },
  contact: {
    width: '100%',
    minWidth: 0,
    justifyContent: 'center',
    color: 'var(--site-primary)',
    borderColor: 'var(--site-primary)',
    '&:hover': {
      color: 'var(--site-primary-hover)',
      borderColor: 'var(--site-primary-hover)',
      backgroundColor: 'var(--site-surface-hover)',
    },
  },
  breadcrumb: {
    minHeight: 'var(--site-control-h-xs)',
    padding: 'var(--site-action-py) var(--site-action-px)',
    color: 'var(--site-text-secondary)',
    border: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {
      color: 'var(--site-primary)',
      border: 0,
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  },
  pagination: {
    minWidth: 'var(--site-control-h-sm)',
    paddingInline: 'var(--site-space-2)',
    position: 'relative',
    zIndex: 1,
    color: 'var(--site-primary)',
    borderColor: 'var(--site-primary)',
    backgroundColor: 'var(--site-accent-bg)',
    whiteSpace: 'nowrap',
    '&:hover': {
      borderColor: 'var(--site-primary-hover)',
      backgroundColor: 'var(--site-surface-hover)',
    },
    '&.Mui-disabled': {
      zIndex: 0,
      color: 'var(--site-text-secondary)',
      borderColor: 'var(--site-border)',
      backgroundColor: 'var(--site-surface-muted)',
    },
    '&.MuiButton-contained': {
      color: 'var(--site-primary-contrast)',
      borderColor: 'var(--site-primary)',
      backgroundColor: 'var(--site-primary)',
    },
  },
  'compact-icon': {
    minWidth: 'var(--site-control-h-sm)',
    paddingInline: 'var(--site-space-2)',
  },
};
