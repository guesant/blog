import { RevealDialog } from './reveal-dialog';
import type { useProtectedEmailController } from './use-protected-email-controller';

type ProtectedEmailDialogProps = {
  controller: ReturnType<typeof useProtectedEmailController>;
};

export function ProtectedEmailDialog(props: ProtectedEmailDialogProps) {
  return (
    <RevealDialog
      open={props.controller.open}
      onClose={() => props.controller.setOpen(false)}
      state={props.controller.state}
      email={props.controller.email}
      onRetry={props.controller.reveal}
      t={props.controller.t}
    />
  );
}
