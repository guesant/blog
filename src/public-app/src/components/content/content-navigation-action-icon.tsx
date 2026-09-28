import { Icon } from '../primitives/icon';
import { ArrowForward } from '../ui';

type ContentNavigationActionIconProps = {
  direction: 'forward' | 'external';
  size?: number;
};

export function ContentNavigationActionIcon(props: ContentNavigationActionIconProps) {
  if (props.direction === 'forward') {
    return <ArrowForward fontSize="small" />;
  }

  return <Icon name="north-east" size={props.size ?? 15} />;
}
