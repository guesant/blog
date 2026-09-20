'use client';

import { OptionSelect } from '../../ui';
import { toolCategories, toolCategoryLabel } from '@portfolio/data/config/tool-catalog';

type ToolCategorySelectProps = {
  label: string;
  allLabel: string;
  value: string;
  locale: 'en' | 'pt-BR';
  onChange: (value: string) => void;
};

export function ToolCategorySelect(props: ToolCategorySelectProps) {
  const options = [
    { value: '', label: props.allLabel },
    ...toolCategories.map((category) => ({
      value: category,
      label: toolCategoryLabel(category, props.locale),
    })),
  ];

  return (
    <OptionSelect
      label={props.label}
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      options={options}
    />
  );
}
