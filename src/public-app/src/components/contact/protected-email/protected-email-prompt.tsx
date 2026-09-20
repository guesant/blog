import { useTranslations } from '@/i18n/compat';
import { RevealDialog } from './reveal-dialog';
import { RevealPanel } from './reveal-panel';
import type { ProtectedEmailProps } from './types';
import type { useProtectedEmailController } from './use-protected-email-controller';

type ProtectedEmailPromptProps = {
  props: ProtectedEmailProps;
  controller: ReturnType<typeof useProtectedEmailController>;
};

export function ProtectedEmailPrompt(props: ProtectedEmailPromptProps) {
  const t = useTranslations('Common');

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
        t={t}
      />
      <RevealDialog
        open={props.controller.open}
        onClose={() => props.controller.setOpen(false)}
        state={props.controller.state}
        email={props.controller.email}
        onRetry={props.controller.reveal}
        t={t}
      />
    </>
  );
}
