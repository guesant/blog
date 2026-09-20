import type { FeedSelectDefinition } from './feed-select.types';

type BuildTypeSelectProps = {
  types: string[];
  fixedKind?: string;
  label: string;
  selectedValue: string;
  onChange: (value: string) => void;
  typeLabel: (value: string) => string;
};

export function buildTypeSelect(props: BuildTypeSelectProps): FeedSelectDefinition | undefined {
  if (props.types.length === 0 || (props.fixedKind && props.fixedKind !== 'achado')) {
    return undefined;
  }

  return {
    id: 'content-type',
    label: props.label,
    icon: 'layout-grid',
    value: props.selectedValue,
    clearValue: '',
    onChange: props.onChange,
    options: [
      { value: '', label: props.label, icon: 'layout-grid' },
      ...props.types.map((value) => ({
        value,
        label: props.typeLabel(value),
        icon: 'tag' as const,
      })),
    ],
  };
}
