import { ProtectedEmailContactRevealedButton } from './protected-email-contact-revealed-button';
import { ProtectedEmailSidebarRevealedButton } from './protected-email-sidebar-revealed-button';
import type { ProtectedEmailRevealedButtonProps as ProtectedEmailRevealedButtonContentProps } from './protected-email-button-types';

type ProtectedEmailRevealedButtonProps = ProtectedEmailRevealedButtonContentProps & {
  presentation: 'contact' | 'sidebar';
};

export function ProtectedEmailRevealedButton(props: ProtectedEmailRevealedButtonProps) {
  const { presentation, ...contentProps } = props;

  if (presentation === 'contact') {
    return <ProtectedEmailContactRevealedButton {...contentProps} />;
  }

  return <ProtectedEmailSidebarRevealedButton {...contentProps} />;
}
