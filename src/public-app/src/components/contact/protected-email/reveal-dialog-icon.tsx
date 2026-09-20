import { Box } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealState } from './types';

type RevealDialogIconProps = { state: RevealState };

export function RevealDialogIcon(props: RevealDialogIconProps) {
  return (
    <Box
      visualVariant={
        props.state === 'working' ? 'protectedEmailDialogIconWorking' : 'protectedEmailDialogIcon'
      }
    >
      <Icon name="mail" size={20} />
    </Box>
  );
}
