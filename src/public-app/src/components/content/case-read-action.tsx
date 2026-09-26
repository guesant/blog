import { Icon } from '../primitives/icon';
import { Typography } from '../ui';

type CaseReadActionProps = {
  label: string;
  visualVariant?: string;
};

export function CaseReadAction(props: CaseReadActionProps) {
  return (
    <Typography color="secondary" visualVariant={props.visualVariant}>
      {props.label} <Icon name="north-east" size={15} />
    </Typography>
  );
}
