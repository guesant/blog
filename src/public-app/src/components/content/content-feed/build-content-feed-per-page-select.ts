import type { FeedSelectDefinition } from './feed-select.types';

type BuildContentFeedPerPageSelectProps = {
  value: number;
  label: string;
  onChange: (value: number) => void;
};

export function buildContentFeedPerPageSelect(
  props: BuildContentFeedPerPageSelectProps,
): FeedSelectDefinition {
  return {
    id: 'content-per-page',
    label: props.label,
    icon: 'list',
    value: String(props.value),
    clearValue: String(props.value),
    onChange: (value) => props.onChange(Number(value)),
    options: [10, 20, 50].map((value) => ({
      value: String(value),
      label: String(value),
      icon: 'list' as const,
    })),
  };
}
