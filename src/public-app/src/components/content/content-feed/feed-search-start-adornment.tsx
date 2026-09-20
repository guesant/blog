import { InputAdornment } from '../../ui';
import { Icon } from '../../primitives/icon';

export function FeedSearchStartAdornment() {
  return (
    <InputAdornment position="start">
      <Icon name="search" size={15} />
    </InputAdornment>
  );
}
