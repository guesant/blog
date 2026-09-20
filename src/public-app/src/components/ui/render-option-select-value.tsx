import type { SelectOption } from './option-select';
import { OptionSelectSelectedValue } from './option-select-selected-value';

export function renderOptionSelectValue(options: readonly SelectOption[], value: string) {
  return <OptionSelectSelectedValue options={options} value={value} />;
}
