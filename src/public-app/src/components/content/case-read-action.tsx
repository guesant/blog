import { Typography } from '../ui';
import { ContentNavigationActionIcon } from './content-navigation-action-icon';

type CaseReadActionProps = {
  label: string;
  visualVariant?: string;
};

export function CaseReadAction(props: CaseReadActionProps) {
  return (
    <Typography color="secondary" visualVariant={props.visualVariant}>
      {props.label} <ContentNavigationActionIcon direction="external" size={15} />
    </Typography>
  );
}
