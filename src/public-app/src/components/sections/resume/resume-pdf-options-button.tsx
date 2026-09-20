import { Button } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { MouseEvent } from 'react';

type ResumePdfOptionsButtonProps = {
  open: boolean;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function ResumePdfOptionsButton(props: ResumePdfOptionsButtonProps) {
  return (
    <Button
      onClick={props.onClick}
      aria-label={props.label}
      aria-haspopup="menu"
      aria-expanded={props.open}
      siteVariant="compact-icon"
      variant="outlined"
      visualVariant="resumePdfOptionsButton"
    >
      <Icon name="chevron-down" size={16} />
    </Button>
  );
}
