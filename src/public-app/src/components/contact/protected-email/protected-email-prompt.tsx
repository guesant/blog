import { ProtectedEmailDialog } from './protected-email-dialog';
import { RevealPanel } from './reveal-panel';
import type { ProtectedEmailProps } from './types';
import type { useProtectedEmailController } from './use-protected-email-controller';

type ProtectedEmailPromptProps = {
  props: ProtectedEmailProps;
  controller: ReturnType<typeof useProtectedEmailController>;
};

export function ProtectedEmailPrompt(props: ProtectedEmailPromptProps) {
  return (
    <>
      <RevealPanel
        state={props.controller.state}
        variant={props.props.variant ?? 'inline'}
        visualVariant={props.props.visualVariant}
        buttonSiteVariant={props.props.buttonSiteVariant}
        color={props.props.color}
        underline={props.props.underline}
        typographyVariant={props.props.typographyVariant}
        onReveal={props.controller.handleTrigger}
        t={props.controller.t}
      />
      <ProtectedEmailDialog controller={props.controller} />
    </>
  );
}
