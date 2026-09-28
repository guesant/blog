'use client';

import { ProtectedEmailLayout } from './protected-email-layout';
import { RevealTriggerButton } from './reveal-trigger-button';
import { RevealedEmailButton } from './revealed-email-button';
import type { ProtectedEmailProps } from './types';

type ContactProtectedEmailProps = ProtectedEmailProps;

export function ContactProtectedEmail(props: ContactProtectedEmailProps) {
  return (
    <ProtectedEmailLayout
      props={props}
      renderTrigger={(triggerProps) => <RevealTriggerButton {...triggerProps} />}
      renderEmail={(emailProps) => <RevealedEmailButton {...emailProps} />}
    />
  );
}
