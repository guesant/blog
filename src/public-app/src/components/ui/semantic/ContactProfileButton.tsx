import type { ComponentProps } from 'react';
import { Button } from '../button';

type ContactProfileButtonProps = ComponentProps<typeof Button> & Record<string, unknown>;

export function ContactProfileButton(props: ContactProfileButtonProps) {
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
          color: 'var(--site-primary)',
          borderColor: 'var(--site-primary)',
          '&:hover': {
            color: 'var(--site-primary-hover)',
            borderColor: 'var(--site-primary-hover)',
            backgroundColor: 'var(--site-surface-hover)',
          },
        },
        props.sx ?? {},
      ]}
    />
  );
}
