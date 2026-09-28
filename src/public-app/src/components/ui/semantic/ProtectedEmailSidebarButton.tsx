import type { ComponentProps } from 'react';
import { Button } from '../button';

type ProtectedEmailSidebarButtonProps = ComponentProps<typeof Button>;

export function ProtectedEmailSidebarButton(props: ProtectedEmailSidebarButtonProps) {
  const Component = Button;

  return (
    <Component
      {...props}
      sx={[
        {
          justifyContent: 'flex-start',
          textAlign: 'left',
          '& .MuiButton-endIcon': { marginLeft: 'auto' },
          width: '100%',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textTransform: 'none',
          color: 'var(--site-primary-muted)',
          borderColor: 'var(--site-primary-muted)',
          '&:hover': {
            color: 'var(--site-primary)',
            borderColor: 'var(--site-primary)',
            backgroundColor: 'var(--site-surface-hover)',
          },
        },
        props.sx ?? {},
      ]}
    />
  );
}
