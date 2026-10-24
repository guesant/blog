import type { FeedSelectDefinition } from './feed-select.types';

type BuildContentKindOptionsProps = {
  writingsCount: number;
  collectionsCount: number;
  label: string;
  writingLabel: string;
  collectionsLabel: string;
};

export function buildContentKindOptions(
  props: BuildContentKindOptionsProps,
): FeedSelectDefinition['options'] {
  return [
    { value: 'all', label: props.label, icon: 'filter' },
    {
      value: 'post',
      label: props.writingLabel,
      icon: 'pen-line',
      disabled: props.writingsCount === 0,
    },
    {
      value: 'colecao',
      label: props.collectionsLabel,
      icon: 'archive',
      disabled: props.collectionsCount === 0,
    },
  ];
}
