export const sidebarActionSx = {
  width: '100%',
  minWidth: 0,
  height: 'var(--site-control-h-sm)',
  minHeight: 'var(--site-control-h-sm)',
  justifyContent: 'flex-start',
  paddingInline: 'var(--site-space-3)',
  paddingBlock: 'var(--site-space-1)',
  border: 'var(--site-border-width) solid',
  borderColor: 'divider',
  borderRadius: 'var(--site-radius)',
  color: 'text.secondary',
  fontSize: 'var(--site-text-action)',
  fontWeight: 500,
  lineHeight: 'var(--site-leading-normal)',
  textAlign: 'left',
  '& .MuiButton-startIcon': {
    marginLeft: 0,
    marginRight: 'var(--site-space-2)',
  },
  '&:hover': {
    color: 'secondary.main',
    bgcolor: 'action.hover',
    borderColor: 'secondary.main',
  },
} as const;

export const sidebarSubnavSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-space-3)',
  mt: 'var(--site-space-3)',
  ml: 'var(--site-space-3)',
  pl: 'var(--site-space-3)',
  borderLeft: 'var(--site-border-width) solid',
  borderColor: 'divider',
} as const;
