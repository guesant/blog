import type { ProtectedEmailRevealedButtonProps as ProtectedEmailRevealedButtonContentProps } from './protected-email-button-types';
import { ProtectedEmailRevealedActionButton } from './protected-email-revealed-action-button';

type ProtectedEmailContactRevealedButtonProps = ProtectedEmailRevealedButtonContentProps;

export function ProtectedEmailContactRevealedButton(
  props: ProtectedEmailContactRevealedButtonProps,
) {
  return <ProtectedEmailRevealedActionButton {...props} size="medium" iconSize={18} />;
}
