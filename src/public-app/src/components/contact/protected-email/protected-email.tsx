'use client';

import { ProtectedEmailPrompt } from './protected-email-prompt';
import { ProtectedEmailRevealed } from './protected-email-revealed';
import type { ProtectedEmailProps } from './types';
import { useProtectedEmailController } from './use-protected-email-controller';

export function ProtectedEmail(props: ProtectedEmailProps) {
  const controller = useProtectedEmailController({
    challenge: props.challenge,
    available: props.available,
  });

  if (!props.challenge && !props.available) {
    return null;
  }

  if (controller.state === 'revealed' && !controller.open) {
    return <ProtectedEmailRevealed props={props} controller={controller} />;
  }

  return <ProtectedEmailPrompt props={props} controller={controller} />;
}
