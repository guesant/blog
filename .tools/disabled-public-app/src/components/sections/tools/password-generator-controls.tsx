import { Stack } from '../../ui';
import { CharacterSetControls } from './character-set-controls';
import { GeneratorLengthField } from './generator-length-field';

type PasswordGeneratorControlsProps = {
  length: number;
  enabled: Record<string, boolean>;
  labels: (key: string) => string;
  onLengthChange: (value: number) => void;
  onEnabledChange: (name: string, checked: boolean) => void;
};

export function PasswordGeneratorControls(props: PasswordGeneratorControlsProps) {
  return (
    <Stack spacing={3}>
      <GeneratorLengthField
        id="password-length"
        label={props.labels('length')}
        value={props.length}
        minimum={8}
        maximum={64}
        onChange={props.onLengthChange}
      />
      <CharacterSetControls
        names={Object.keys(props.enabled)}
        enabled={props.enabled}
        label={props.labels}
        onChange={props.onEnabledChange}
      />
    </Stack>
  );
}
