import { FormControl, InputLabel } from '../../ui';
import { ToolCategorySelect } from './tool-category-select';

type ToolCategoryFieldProps = {
  label: string;
  allLabel: string;
  value: string;
  locale: 'en' | 'pt-BR';
  onChange: (value: string) => void;
};

export function ToolCategoryField(props: ToolCategoryFieldProps) {
  return (
    <FormControl size="small" visualVariant="listingField">
      <InputLabel>{props.label}</InputLabel>
      <ToolCategorySelect {...props} />
    </FormControl>
  );
}
