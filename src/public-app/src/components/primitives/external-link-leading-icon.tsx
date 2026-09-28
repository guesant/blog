import { type IconName } from './icon';
import { MutedIcon } from '../ui/semantic/MutedIcon';

type ExternalLinkLeadingIconProps = {
  name?: IconName;
  size: number;
};

export function ExternalLinkLeadingIcon(props: ExternalLinkLeadingIconProps) {
  if (!props.name) {
    return null;
  }

  return <MutedIcon name={props.name} size={props.size} />;
}
