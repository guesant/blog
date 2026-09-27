import type { IconName } from '../primitives/icon';
import { Icon } from '../primitives/icon';
import { Button } from '../ui';

type ContentActionButtonProps = {
  icon: IconName;
  label: string;
  onClick: () => void;
};

export function ContentActionButton(props: ContentActionButtonProps) {
  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<Icon name={props.icon} size={14} />}
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  );
}
