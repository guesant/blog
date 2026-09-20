import { Checkbox, FormControlLabel } from '../../ui';

type CharacterSetControlProps = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (name: string, checked: boolean) => void;
};

export function CharacterSetControl(props: CharacterSetControlProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={props.checked}
          onChange={(event) => props.onChange(props.name, event.target.checked)}
        />
      }
      label={props.label}
    />
  );
}
