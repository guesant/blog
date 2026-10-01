import type { ProtectedEmailInlineActionProps } from './protected-email-inline-action-types';
import { ProtectedEmailRevealedInlineAction } from './protected-email-revealed-inline-action';
import { ProtectedEmailTriggerBusyInlineAction } from './protected-email-trigger-busy-inline-action';
import { ProtectedEmailTriggerInlineAction } from './protected-email-trigger-inline-action';

export function ProtectedEmailInlineAction(props: ProtectedEmailInlineActionProps) {
  const { mode, ...contentProps } = props;

  if (mode === 'revealed') {
    return <ProtectedEmailRevealedInlineAction {...contentProps} />;
  }

  if (mode === 'trigger') {
    return <ProtectedEmailTriggerInlineAction {...contentProps} />;
  }

  return <ProtectedEmailTriggerBusyInlineAction {...contentProps} />;
}
