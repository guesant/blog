import { RevealedEmail } from './revealed-email';
import { ProtectedEmailDialog } from './protected-email-dialog';
import type { ProtectedEmailProps } from './types';
import type { useProtectedEmailController } from './use-protected-email-controller';

type ProtectedEmailRevealedProps = {
  props: ProtectedEmailProps;
  controller: ReturnType<typeof useProtectedEmailController>;
};

export function ProtectedEmailRevealed(props: ProtectedEmailRevealedProps) {
  return (
    <>
      <RevealedEmail
        ref={props.controller.linkRef}
        email={props.controller.email}
        label={props.props.label}
        variant={props.props.variant ?? 'inline'}
        visualVariant={props.props.visualVariant}
        buttonSiteVariant={props.props.buttonSiteVariant}
        showAddress={props.props.showAddress ?? false}
        color={props.props.color}
        underline={props.props.underline}
        typographyVariant={props.props.typographyVariant}
        onReveal={props.controller.handleTrigger}
      />
      <ProtectedEmailDialog controller={props.controller} />
    </>
  );
}
