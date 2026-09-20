import type { IconName } from '../../primitives/icon';

type FeedSelectOption = {
  value: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
};

export type FeedSelectDefinition = {
  id: string;
  label: string;
  icon?: IconName;
  value: string;
  clearValue?: string;
  options: FeedSelectOption[];
  onChange: (value: string) => void;
};
