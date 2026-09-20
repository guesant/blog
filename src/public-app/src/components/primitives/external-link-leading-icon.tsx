import { Icon, type IconName } from './icon';

type ExternalLinkLeadingIconProps = {
  name?: IconName;
  size: number;
};

export function ExternalLinkLeadingIcon(props: ExternalLinkLeadingIconProps) {
  if (!props.name) {
    return null;
  }

  return <Icon name={props.name} size={props.size} visualVariant="muted" />;
}
