import type { SortMode } from './types';
import type { FeedSelectDefinition } from './feed-select.types';

type BuildSortSelectProps = {
  label: string;
  selectedValue: SortMode;
  onChange: (value: SortMode) => void;
  newestLabel: string;
  oldestLabel: string;
  alphabeticalLabel: string;
  popularLabel: string;
};

export function buildSortSelect(props: BuildSortSelectProps): FeedSelectDefinition {
  return {
    id: 'content-sort',
    label: props.label,
    icon: 'calendar',
    value: props.selectedValue,
    clearValue: 'desc',
    onChange: (value) => props.onChange(value as SortMode),
    options: [
      { value: 'desc', label: props.newestLabel, icon: 'calendar' },
      { value: 'asc', label: props.oldestLabel, icon: 'clock' },
      { value: 'alpha', label: props.alphabeticalLabel, icon: 'arrow' },
      { value: 'popular', label: props.popularLabel, icon: 'star' },
    ],
  };
}
