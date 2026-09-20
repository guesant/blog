import { Icon } from '../../primitives/icon';
import type { SelectOption } from '../../ui';
import type { FeedSelectDefinition } from './feed-select.types';

type BuildFeedSelectOptionProps = {
  option: FeedSelectDefinition['options'][number];
};

export function buildFeedSelectOption(props: BuildFeedSelectOptionProps): SelectOption {
  return {
    value: props.option.value,
    label: props.option.label,
    disabled: props.option.disabled,
    icon: props.option.icon ? <Icon name={props.option.icon} size={15} /> : undefined,
  };
}
