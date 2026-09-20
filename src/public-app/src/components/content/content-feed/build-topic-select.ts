import type { FeedSelectDefinition } from './feed-select.types';

type BuildTopicSelectProps = {
  topics: Array<{ name: string; slug?: string }>;
  label: string;
  selectedValue: string;
  onChange: (value: string) => void;
};

export function buildTopicSelect(props: BuildTopicSelectProps): FeedSelectDefinition | undefined {
  if (props.topics.length === 0) {
    return undefined;
  }

  return {
    id: 'content-topic',
    label: props.label,
    icon: 'tag',
    value: props.selectedValue,
    clearValue: '',
    onChange: props.onChange,
    options: [
      { value: '', label: props.label, icon: 'tag' },
      ...props.topics.map((item) => ({
        value: item.slug ?? item.name,
        label: item.name,
        icon: 'tag' as const,
      })),
    ],
  };
}
