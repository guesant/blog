'use client';

import { ProtectedEmailLayout } from './protected-email-layout';
import { RevealTriggerSidebar } from './reveal-trigger-sidebar';
import { RevealedEmailSidebar } from './revealed-email-sidebar';
import type { ProtectedEmailProps } from './types';

type SidebarProtectedEmailProps = ProtectedEmailProps;

export function SidebarProtectedEmail(props: SidebarProtectedEmailProps) {
  return (
    <ProtectedEmailLayout
      props={props}
      renderTrigger={(triggerProps) => <RevealTriggerSidebar {...triggerProps} />}
      renderEmail={(emailProps) => <RevealedEmailSidebar {...emailProps} />}
    />
  );
}
