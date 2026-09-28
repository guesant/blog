'use client';

import { ProtectedEmailLayout } from './protected-email-layout';
import { RevealTriggerInline } from './reveal-trigger-inline';
import { RevealedEmailInline } from './revealed-email-inline';
import type { ProtectedEmailProps } from './types';

type InlineProtectedEmailProps = ProtectedEmailProps;

export function InlineProtectedEmail(props: InlineProtectedEmailProps) {
  return (
    <ProtectedEmailLayout
      props={props}
      renderTrigger={(triggerProps) => <RevealTriggerInline {...triggerProps} />}
      renderEmail={(emailProps) => <RevealedEmailInline {...emailProps} />}
    />
  );
}
