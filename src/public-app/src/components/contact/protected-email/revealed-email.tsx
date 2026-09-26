'use client';

import type { RevealedEmailProps } from './types';
import { RevealedEmailButton } from './revealed-email-button';
import { RevealedEmailInline } from './revealed-email-inline';
import { RevealedEmailSidebar } from './revealed-email-sidebar';
import { ProtectedEmailVariantRenderer } from './protected-email-variant-renderer';

export function RevealedEmail(props: RevealedEmailProps) {
  return (
    <ProtectedEmailVariantRenderer
      variant={props.variant}
      button={<RevealedEmailButton {...props} />}
      sidebar={<RevealedEmailSidebar {...props} />}
      inline={<RevealedEmailInline {...props} />}
    />
  );
}
