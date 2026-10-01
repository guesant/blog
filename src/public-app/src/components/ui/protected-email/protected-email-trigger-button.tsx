import { ProtectedEmailContactTriggerButton } from './protected-email-contact-trigger-button';
import { ProtectedEmailSidebarTriggerButton } from './protected-email-sidebar-trigger-button';
import type { ProtectedEmailTriggerButtonProps as ProtectedEmailTriggerButtonContentProps } from './protected-email-button-types';

type ProtectedEmailTriggerButtonProps = ProtectedEmailTriggerButtonContentProps & {
  presentation: 'contact' | 'sidebar';
};

export function ProtectedEmailTriggerButton(props: ProtectedEmailTriggerButtonProps) {
  const { presentation, ...contentProps } = props;

  if (presentation === 'contact') {
    return <ProtectedEmailContactTriggerButton {...contentProps} />;
  }

  return <ProtectedEmailSidebarTriggerButton {...contentProps} />;
}
