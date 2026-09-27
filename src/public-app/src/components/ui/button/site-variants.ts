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
  | 'breadcrumb-home'
  | 'compact-icon';

const textButtonContentSx = {
  justifyContent: 'flex-start',
  textAlign: 'left',
  '& .MuiButton-endIcon': { marginLeft: 'auto' },
};

const actionButtonSx: SxProps<Theme> = {
  ...textButtonContentSx,
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
    ...textButtonContentSx,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textTransform: 'none',
  },
  sidebar: {
    ...textButtonContentSx,
    width: '100%',
    minWidth: 0,
    padding: 'var(--site-action-py) var(--site-space-3)',
    color: 'var(--site-primary-muted)',
    borderColor: 'var(--site-primary-muted)',
    '&:hover': {
      color: 'var(--site-primary)',
      borderColor: 'var(--site-primary)',
      backgroundColor: 'var(--site-surface-hover)',
    },
  },
  action: {
    ...actionButtonSx,
  },
  'action-icon': {
    ...actionButtonSx,
    width: 'var(--site-control-h-sm)',
    minWidth: 'var(--site-control-h-sm)',
    padding: 'var(--site-space-1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flex: '0 0 auto',
  },
  availability: {
    ...textButtonContentSx,
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
    ...textButtonContentSx,
    width: '100%',
    minWidth: 0,
    textTransform: 'none',
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
    ...textButtonContentSx,
    width: '100%',
    minWidth: 0,
    color: 'var(--site-primary)',
    borderColor: 'var(--site-primary)',
    '&:hover': {
      color: 'var(--site-primary-hover)',
      borderColor: 'var(--site-primary-hover)',
      backgroundColor: 'var(--site-surface-hover)',
    },
  },
  breadcrumb: {
    ...textButtonContentSx,
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
  'breadcrumb-home': {
    ...textButtonContentSx,
    minHeight: 'var(--site-control-h-xs)',
    padding: 'var(--site-action-py) var(--site-action-px) var(--site-action-py) 0',
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
  'compact-icon': {
    minWidth: 'var(--site-control-h-sm)',
    paddingInline: 'var(--site-space-2)',
  },
};
