'use client';

import type { ReactNode } from 'react';
import { ProtectedEmailPrompt } from './protected-email-prompt';
import { ProtectedEmailRevealed } from './protected-email-revealed';
import type {
  ProtectedEmailProps,
  ProtectedEmailPromptRenderProps,
  ProtectedEmailRevealedRenderProps,
} from './types';
import { useProtectedEmailController } from './use-protected-email-controller';

type ProtectedEmailLayoutProps = {
  props: ProtectedEmailProps;
  renderTrigger: (props: ProtectedEmailPromptRenderProps) => ReactNode;
  renderEmail: (props: ProtectedEmailRevealedRenderProps) => ReactNode;
};

export function ProtectedEmailLayout(props: ProtectedEmailLayoutProps) {
  const controller = useProtectedEmailController({
    challenge: props.props.challenge,
    available: props.props.available,
  });

  if (!props.props.challenge && !props.props.available) {
    return null;
  }

  if (controller.state === 'revealed') {
    return (
      <ProtectedEmailRevealed
        props={props.props}
        controller={controller}
        renderEmail={props.renderEmail}
      />
    );
  }

  return (
    <ProtectedEmailPrompt
      props={props.props}
      controller={controller}
      renderTrigger={(busy) =>
        props.renderTrigger({
          busy,
          label: controller.t('reveal'),
          onReveal: controller.handleTrigger,
          color: props.props.color,
          underline: props.props.underline,
        })
      }
    />
  );
}
