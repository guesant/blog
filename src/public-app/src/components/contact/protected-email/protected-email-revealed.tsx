import type { ReactNode } from 'react';
import { ProtectedEmailDialog } from './protected-email-dialog';
import type { ProtectedEmailProps, ProtectedEmailRevealedRenderProps } from './types';
import type { useProtectedEmailController } from './use-protected-email-controller';

type ProtectedEmailRevealedProps = {
  props: ProtectedEmailProps;
  controller: ReturnType<typeof useProtectedEmailController>;
  renderEmail: (props: ProtectedEmailRevealedRenderProps) => ReactNode;
};

export function ProtectedEmailRevealed(props: ProtectedEmailRevealedProps) {
  return (
    <>
      {props.renderEmail({
        email: props.controller.email,
        onReveal: props.controller.handleTrigger,
        label: props.props.label,
        showAddress: props.props.showAddress ?? false,
        color: props.props.color,
        underline: props.props.underline,
        ref: props.controller.linkRef,
      })}
      <ProtectedEmailDialog controller={props.controller} />
    </>
  );
}
