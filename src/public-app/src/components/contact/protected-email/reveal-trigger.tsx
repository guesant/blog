'use client';

import type { RevealTriggerProps } from './types';
import { RevealTriggerButton } from './reveal-trigger-button';
import { RevealTriggerInline } from './reveal-trigger-inline';
import { RevealTriggerSidebar } from './reveal-trigger-sidebar';
import { ProtectedEmailVariantRenderer } from './protected-email-variant-renderer';

export function RevealTrigger(props: RevealTriggerProps) {
  return (
    <ProtectedEmailVariantRenderer
      variant={props.variant}
      button={<RevealTriggerButton {...props} />}
      sidebar={<RevealTriggerSidebar {...props} />}
      inline={<RevealTriggerInline {...props} />}
    />
  );
}
