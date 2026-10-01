import type { ProtectedEmailRevealedButtonProps as ProtectedEmailRevealedButtonContentProps } from './protected-email-button-types';
import { ProtectedEmailRevealedActionButton } from './protected-email-revealed-action-button';

type ProtectedEmailSidebarRevealedButtonProps = ProtectedEmailRevealedButtonContentProps;

export function ProtectedEmailSidebarRevealedButton(
  props: ProtectedEmailSidebarRevealedButtonProps,
) {
  return <ProtectedEmailRevealedActionButton {...props} size="small" iconSize={14} />;
}
