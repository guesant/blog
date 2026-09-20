import { Stack } from '../../ui';
import { CharacterSetControl } from './character-set-control';

type CharacterSetControlsProps = {
  names: string[];
  enabled: Record<string, boolean>;
  label: (name: string) => string;
  onChange: (name: string, checked: boolean) => void;
};

export function CharacterSetControls(props: CharacterSetControlsProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" gap={2}>
      {props.names.map((name) => (
        <CharacterSetControl
          key={name}
          name={name}
          label={props.label(name)}
          checked={props.enabled[name]}
          onChange={props.onChange}
        />
      ))}
    </Stack>
  );
}
