import type { ReactNode } from 'react';
import type { LinkProps } from '../link';

type ProtectedEmailInlineActionMode = 'revealed' | 'trigger' | 'triggerBusy';

export type ProtectedEmailInlineActionProps = {
  mode: ProtectedEmailInlineActionMode;
  onClick: () => void;
  disabled?: boolean;
  ref?: (element: HTMLElement | null) => void;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  variant?: LinkProps['variant'];
  children: ReactNode;
};

export type ProtectedEmailInlineActionVariantProps = Omit<ProtectedEmailInlineActionProps, 'mode'>;
