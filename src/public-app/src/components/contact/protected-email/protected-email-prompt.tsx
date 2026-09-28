import type { ReactNode } from 'react';
import { ProtectedEmailDialog } from './protected-email-dialog';
import { RevealPanel } from './reveal-panel';
import type { ProtectedEmailProps } from './types';
import type { useProtectedEmailController } from './use-protected-email-controller';

type ProtectedEmailPromptProps = {
  props: ProtectedEmailProps;
  controller: ReturnType<typeof useProtectedEmailController>;
  renderTrigger: (busy: boolean) => ReactNode;
};

export function ProtectedEmailPrompt(props: ProtectedEmailPromptProps) {
  return (
    <>
      <RevealPanel
        state={props.controller.state}
        t={props.controller.t}
        renderTrigger={props.renderTrigger}
      />
      <ProtectedEmailDialog controller={props.controller} />
    </>
  );
}
