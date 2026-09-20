import type { SelectOption } from '../../ui';
import type { FeedSelectDefinition } from './feed-select.types';
import { buildFeedSelectOption } from './build-feed-select-option';

type BuildFeedSelectOptionsProps = {
  options: FeedSelectDefinition['options'];
};

export function buildFeedSelectOptions(props: BuildFeedSelectOptionsProps): SelectOption[] {
  return props.options.map((option) => buildFeedSelectOption({ option }));
}
