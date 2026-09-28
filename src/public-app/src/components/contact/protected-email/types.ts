import type { LinkProps } from '../../ui';
import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';
import type { CommonTranslator } from '@/i18n/compat-support';
import type { ReactNode } from 'react';

export type RevealState = 'idle' | 'working' | 'revealed' | 'error';

export type Translate = CommonTranslator;

export type SettleReveal = (next: RevealState, address: string) => void;

export type ProtectedEmailProps = {
  challenge?: ProtectedEmailChallenge;
  available?: boolean;
  label: string;
  showAddress?: boolean;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
};

export type RevealPanelProps = {
  state: RevealState;
  t: Translate;
  renderTrigger: (busy: boolean) => ReactNode;
};

export type RevealTriggerProps = {
  busy: boolean;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  label: string;
  onReveal: () => void;
};

export type RevealedEmailProps = {
  email: string;
  onReveal: () => void;
  label: string;
  showAddress: boolean;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  ref?: (element: HTMLElement | null) => void;
};

export type ProtectedEmailPromptRenderProps = {
  busy: boolean;
  label: string;
  onReveal: () => void;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
};

export type ProtectedEmailRevealedRenderProps = Omit<RevealedEmailProps, 'email'> & {
  email: string;
};

export type RevealDialogProps = {
  open: boolean;
  onClose: () => void;
  state: RevealState;
  email: string;
  onRetry: () => void;
  t: Translate;
};

export type RevealDialogWorkingProps = {
  t: Translate;
};

export type RevealDialogRevealedProps = {
  email: string;
  t: Translate;
};

export type RevealDialogErrorProps = {
  onRetry: () => void;
  t: Translate;
};

export type RevealDialogBodyProps = {
  state: RevealState;
  email: string;
  onRetry: () => void;
  t: Translate;
};
