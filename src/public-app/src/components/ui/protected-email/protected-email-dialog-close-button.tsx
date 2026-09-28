import type { ReactNode } from 'react';
import { IconButton } from '../icon-button';

type ProtectedEmailDialogCloseButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

const buttonStyles = {
  position: 'absolute',
  insetBlockStart: 'var(--site-space-2)',
  insetInlineEnd: 'var(--site-space-2)',
};

export function ProtectedEmailDialogCloseButton(props: ProtectedEmailDialogCloseButtonProps) {
  return (
    <IconButton onClick={props.onClick} size="small" aria-label={props.label} sx={buttonStyles}>
      {props.children}
    </IconButton>
  );
}
