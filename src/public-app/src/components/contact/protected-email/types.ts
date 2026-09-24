import type { LinkProps } from '../../ui';
import type { SiteButtonVariant } from '../../ui';
import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';
import { useTranslations } from '@/i18n/compat';

export type RevealState = 'idle' | 'working' | 'revealed' | 'error';

type RevealVariant = 'button' | 'inline' | 'sidebar';

export type Translate = ReturnType<typeof useTranslations>;

export type SettleReveal = (next: RevealState, address: string) => void;

export type ProtectedEmailProps = {
  challenge?: ProtectedEmailChallenge;
  available?: boolean;
  label: string;
  variant?: RevealVariant;
  visualVariant?: string;
  buttonSiteVariant?: SiteButtonVariant;
  showAddress?: boolean;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  typographyVariant?: LinkProps['variant'];
};

export type RevealPanelProps = {
  state: RevealState;
  variant: RevealVariant;
  visualVariant?: string;
  buttonSiteVariant?: SiteButtonVariant;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  typographyVariant?: LinkProps['variant'];
  onReveal: () => void;
  t: Translate;
};

export type RevealTriggerProps = {
  busy: boolean;
  variant: RevealVariant;
  visualVariant?: string;
  buttonSiteVariant?: SiteButtonVariant;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  typographyVariant?: LinkProps['variant'];
  label: string;
  onReveal: () => void;
};

export type RevealedEmailProps = {
  email: string;
  onReveal: () => void;
  label: string;
  variant: RevealVariant;
  visualVariant?: string;
  buttonSiteVariant?: SiteButtonVariant;
  showAddress: boolean;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  typographyVariant?: LinkProps['variant'];
  ref?: (element: HTMLElement | null) => void;
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
