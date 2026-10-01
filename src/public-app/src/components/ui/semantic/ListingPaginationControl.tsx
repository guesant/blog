import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Pagination as BaseComponent } from '@/components/ui/pagination';

export const ListingPaginationControl = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  mt: 'var(--site-space-6)',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '100%',
  '& .MuiPagination-ul': {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    width: '100%',
  },
  '& .MuiPaginationItem-root': {
    margin: 0,
    width: 'auto',
    minWidth: 'var(--site-control-h-sm)',
    height: 'var(--site-control-h-sm)',
    borderRadius: 0,
    borderColor: 'var(--site-primary)',
    color: 'var(--site-primary)',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  '& .MuiPaginationItem-root + .MuiPaginationItem-root': {
    marginLeft: 'calc(var(--site-border-width) * -1)',
    marginTop: 0,
  },
  '& .MuiPaginationItem-firstLast': {
    display: { xs: 'none', sm: 'inline-flex' },
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
});
