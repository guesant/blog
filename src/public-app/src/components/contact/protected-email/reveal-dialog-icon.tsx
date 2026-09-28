import { ProtectedEmailDialogIconFrame } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealState } from './types';

type RevealDialogIconProps = { state: RevealState };

export function RevealDialogIcon(props: RevealDialogIconProps) {
  return (
    <ProtectedEmailDialogIconFrame working={props.state === 'working'}>
      <Icon name="mail" size={20} />
    </ProtectedEmailDialogIconFrame>
  );
}
